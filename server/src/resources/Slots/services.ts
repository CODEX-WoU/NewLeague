import { Insertable } from "kysely"
import { DayEnum, Slots } from "kysely-codegen"
import db from "../../services/db"
import { ConflictingSlotErr } from "../../common/custom_errors/slotErr"
import logger from "../../common/logger"

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

// HELPER FUNCTIONS START HERE

async function checkConflicts(newSlots: Insertable<Slots>[]): Promise<false | [boolean, Insertable<Slots>]> {
  // Step 1: Get all unique facility_id and day combinations from the new slots
  const uniqueCombinations = new Map<string, Insertable<Slots>[]>()
  newSlots.forEach((slot) => {
    const key = `${slot.facility_id}_${slot.day}`
    if (!uniqueCombinations.has(key)) {
      uniqueCombinations.set(key, [])
    }
    uniqueCombinations.get(key)!.push(slot)
  })

  // Step 2: For each unique combination, check for conflicts
  for (const [key, slots] of uniqueCombinations) {
    const [facility_id, day] = key.split("_")

    // Fetch existing slots from the database for this facility_id and day
    const existingSlots = await db
      .selectFrom("slots")
      .select(["start_time", "end_time"])
      .where("facility_id", "=", facility_id)
      .where("day", "=", day as DayEnum)
      .execute()

    // Check for conflicts
    for (const newSlot of slots) {
      for (const existingSlot of existingSlots) {
        if (newSlot.start_time < existingSlot.end_time && newSlot.end_time > existingSlot.start_time) {
          // Conflict found
          return [true, newSlot]
        }
      }
    }
  }

  // No conflicts found
  return false
}
