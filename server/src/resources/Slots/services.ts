import { Insertable, sql, Updateable } from "kysely"
import { DayEnum, Slots } from "kysely-codegen"
import db from "../../services/db"
import { ConflictingSlotErr } from "../../common/custom_errors/slotErr"
import logger from "../../common/logger"
import EmptyObjectError from "../../common/custom_errors/emptyObjectErr"
import { IAvailabilityParams, IPagingMarkers, ISlotsFilters, ISlotsSortParams } from "./interfaces"

export const addSlotService = async (slotInfo: Insertable<Slots>) => {
  if (await checkConflicts([slotInfo])) {
    logger.debug(
      "Slot conflict when adding slot with timings: " +
        slotInfo.start_time +
        " - " +
        slotInfo.end_time +
        ` with facilityId = ${slotInfo.facility_id} and day = ${slotInfo.day}`,
    )
    throw new ConflictingSlotErr()
  }

  const newSlot = await db.insertInto("slots").values(slotInfo).returningAll().executeTakeFirstOrThrow()

  logger.info(`New slot with facility ID = ${newSlot.facility_id} and ID = ${newSlot.id} added`)

  return newSlot
}

export const addMultipleSlotsService = async (slots: Insertable<Slots>[]) => {
  const conflict = await checkConflicts(slots)
  if (conflict) {
    logger.debug(
      `Slot conflict when adding slot with timings: ${conflict[1].start_time} - ${conflict[1].end_time} with facilityId = ${conflict[1].facility_id} and day = ${conflict[1].day}`,
    )
    throw new ConflictingSlotErr()
  }

  const newSlotIds = await db.insertInto("slots").values(slots).returning("id").execute()
  logger.info(`Added ${newSlotIds.length} new slots`)

  return newSlotIds
}

export const selectSlotByIdService = async (id: string) => {
  const slot = await db
    .selectFrom("slots")
    .where("slots.id", "=", id)
    .leftJoin("facilities", "slots.facility_id", "facilities.id")
    .select([
      "courts_available_at_slot",
      "day",
      "facilities.name",
      "slots.id",
      "slots.end_time",
      "slots.start_time",
      "slots.facility_id",
      "slots.payment_amount_inr",
    ])
    .executeTakeFirstOrThrow()

  logger.debug("Ran SELECT on slots for id = " + id)

  return slot
}

export const selectSlotsUsingFiltersService = async (
  filters?: ISlotsFilters,
  sortingParams?: ISlotsSortParams,
  paging?: IPagingMarkers,
  availabilityParams?: IAvailabilityParams,
) => {
  var selectStmt = generateBaseSelectStmt(availabilityParams?.date ? new Date(availabilityParams.date) : undefined)

  // Adding filters
  if (filters) {
    if ("ids" in filters) selectStmt = selectStmt.where("id", "in", filters.ids)
    else {
      if (filters.days) selectStmt = selectStmt.where("day", "in", filters.days)
      if (filters.facilities) selectStmt = selectStmt.where("facility_id", "in", filters.facilities)
      if (filters.startsByRange) {
        if (filters.startsByRange.gte) selectStmt = selectStmt.where("start_time", ">=", filters.startsByRange.gte)
        if (filters.startsByRange.lte) selectStmt = selectStmt.where("start_time", "<=", filters.startsByRange.lte)
      }
      if (filters.endsByRange) {
        if (filters.endsByRange.gte) selectStmt = selectStmt.where("end_time", ">=", filters.endsByRange.gte)
        if (filters.endsByRange.lte) selectStmt = selectStmt.where("end_time", "<=", filters.endsByRange.lte)
      }
    }
  }

  // Sorting the results
  if (sortingParams) {
    selectStmt = selectStmt.orderBy(`${sortingParams.sortBy} ${sortingParams.order}`)
  }

  // Implementing paging
  if (paging) {
    selectStmt = selectStmt.offset(paging.index).limit(paging.limit)
  }

  const slots = await selectStmt.execute()
  logger.debug("Ran complex SELECT on slots table")

  return slots
}

export const updateSlotByIdService = async (id: string, slotUpdate: Updateable<Slots>) => {
  if (Object.keys(slotUpdate).length === 0) throw new EmptyObjectError()

  // Checking if conflict will be there after update
  if (slotUpdate.start_time || slotUpdate.end_time) {
    const slotInDb = await selectSlotByIdService(id)

    const startTime = slotUpdate.start_time || slotInDb.start_time
    const endTime = slotUpdate.end_time || slotInDb.end_time
    const facility_id = slotUpdate.facility_id || slotInDb.facility_id
    const day = slotUpdate.day || slotInDb.day

    const conflictingSlot = await checkConflicts([
      {
        ...slotInDb,
        start_time: startTime,
        end_time: endTime,
        ...(slotUpdate.facility_id && { facility_id: slotUpdate.facility_id }),
        ...(slotUpdate.day && { day: slotUpdate.day }),
      },
    ])
    if (conflictingSlot) {
      logger.debug(
        `Conflicting slot when trying to update for ${startTime} - ${endTime} for facilityId = ${facility_id} and day = ${day}`,
      )
      throw new ConflictingSlotErr()
    }
  }

  const updatedSlot = await db
    .updateTable("slots")
    .set(slotUpdate)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow()

  logger.info(`Updated slot with slot ID = ${id}`)
  return updatedSlot
}

/**
 * Deletes a slot given it's ID
 * @param id id of the slot to be deleted
 * @returns {Promise<string>} the id of the deleted slot if operation was successful
 */
export const deleteSlotByIdService = async (id: string): Promise<string> => {
  const deletedSlotId = await db
    .deleteFrom("slots")
    .where("slots.id", "=", id)
    .returning("slots.id")
    .executeTakeFirstOrThrow()

  logger.info(`Deleted slot with ID = ${id}`)
  return deletedSlotId.id
}

// HELPER FUNCTIONS START HERE

/**
 * Checks if any of the `newSlots` that are to be added/updated, conflicts their timings with an existing slot for same day or facility.
 * Also checks if the amount of courts mentioned in the slot is less than or equal to courts available in the facility
 *
 * Does not actually insert into database
 *
 * @param newSlots the slots to be inserted/updated
 * @returns `false` if no conflict. Else, `[true, SLOT]` where `SLOT` is the slot which conflicts with something existing
 */
async function checkConflicts(newSlots: Insertable<Slots>[]): Promise<false | [boolean, Insertable<Slots>]> {
  // Step 1: Get all unique facility_id and day combinations from the new slots
  const uniqueCombinations = new Map<string, Insertable<Slots>[]>()

  const facilityIds: string[] = []
  const slotsByFacility = new Map<string, Insertable<Slots>[]>()

  newSlots.forEach((slot) => {
    const key = `${slot.facility_id}_${slot.day}`
    if (!uniqueCombinations.has(key)) {
      uniqueCombinations.set(key, [])
    }
    uniqueCombinations.get(key)!.push(slot)
    facilityIds.push(slot.facility_id)
    slotsByFacility.set(
      slot.facility_id,
      slotsByFacility.has(slot.facility_id) ? [...slotsByFacility.get(slot.facility_id)!, slot] : [slot],
    )
  })

  // Step 2: For each unique combination, check for conflicts
  for (const [key, slots] of uniqueCombinations) {
    const [facility_id, day] = key.split("_")

    // Fetch existing slots from the database for this facility_id and day
    const existingSlots = await db
      .selectFrom("slots")
      .select(["start_time", "end_time", "id"])
      .where("facility_id", "=", facility_id)
      .where("day", "=", day as DayEnum)
      .execute()

    // Check for conflicts
    for (const newSlot of slots) {
      for (const existingSlot of existingSlots) {
        // ONLY ACTIVATED IN CASE OF UPDATE. observed slot is the one being updated
        if (existingSlot.id === newSlot.id) continue

        if (newSlot.start_time < existingSlot.end_time && newSlot.end_time > existingSlot.start_time) {
          // Conflict found
          return [true, newSlot]
        }
      }
    }
  }

  // Step 3: Check if slot courts exceed courts mentioned in corresponding facility record

  const facilities = await db
    .selectFrom("facilities")
    .select(["id", "number_of_courts"])
    .where("id", "in", Array.from(slotsByFacility.keys()))
    .execute()

  for (const [facilityId, slots] of slotsByFacility) {
    const facility = facilities.filter((f) => f.id === facilityId)[0]
    for (const slot of slots) {
      if (slot.courts_available_at_slot > facility.number_of_courts) return [true, slot]
    }
  }

  // No conflicts found
  return false
}

/**
 * returns a base select statement for `slots`, to build upon
 * @param date add a date if an is_available field is required in output
 * @returns
 */
function generateBaseSelectStmt(date?: Date) {
  if (date) {
    const selectStmt = db
      .with("slot_facility_join", (db) =>
        db
          .selectFrom("slots")
          .leftJoin("facilities", "slots.facility_id", "facilities.id")
          .select((eb) => {
            return [
              "slots.id",
              "slots.courts_available_at_slot",
              "slots.start_time",
              "slots.end_time",
              "slots.day",
              "slots.facility_id",
              "slots.payment_amount_inr",
              "facilities.name as facility_name",
              "facilities.capacity_per_court",
              "facilities.number_of_courts",
              db
                .selectFrom(["booking"])
                .whereRef("booking.slot_id", "=", eb.ref("slots.id"))
                .where("booking.booking_date", "=", date)
                .where("booking.status", "=", "RESERVED")
                .select((eb) => eb.fn.count<number>("booking.id").as("count"))
                .as("booking_count"),
            ]
          }),
      )
      .selectFrom("slot_facility_join")
      .select([
        "id",
        "capacity_per_court",
        "courts_available_at_slot",
        "day",
        "facility_id",
        "facility_name",
        "start_time",
        "end_time",
        "payment_amount_inr",
        // is_available is false if number of bookings for given date and slot is already more than courts of facility
        (eb) =>
          eb
            .case()
            .when("booking_count", ">=", eb.ref("number_of_courts"))
            .then(false)
            .else(true)
            .end()
            .as("is_available"),
      ])
    return selectStmt
  } else
    return db
      .with("slot_facility_join", (db) =>
        db
          .selectFrom("slots")
          .leftJoin("facilities", "slots.facility_id", "facilities.id")
          .select((eb) => {
            return [
              "slots.id",
              "slots.courts_available_at_slot",
              "slots.start_time",
              "slots.end_time",
              "slots.day",
              "slots.facility_id",
              "slots.payment_amount_inr",
              "facilities.name as facility_name",
              "facilities.capacity_per_court",
              "facilities.number_of_courts",
            ]
          }),
      )
      .selectFrom("slot_facility_join")
      .select([
        "id",
        "capacity_per_court",
        "courts_available_at_slot",
        "day",
        "facility_id",
        "facility_name",
        "start_time",
        "end_time",
        "payment_amount_inr",
      ])
}
