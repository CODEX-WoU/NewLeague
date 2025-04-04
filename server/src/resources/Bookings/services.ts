import { selectSlotsUsingFiltersService } from "../Slots/services"
import { SlotUnavailableErr } from "../../common/custom_errors/bookingErr"
import db from "../../services/db"
import logger from "../../common/logger"
import { ICustomBookingInsertable, IGetBookingsFilters, IGetBookingsSortingParams, IPagingParams } from "./interfaces"
import { generateDateIgnoringTz } from "../../util/timeRelated"
import { Booking, BookingStatus } from "kysely-codegen"
import { InvalidBookingStatusErr } from "../../common/custom_errors/bookingErr"
import { Updateable } from "kysely"
import EmptyObjectError from "../../common/custom_errors/emptyObjectErr"

export const addBookingService = async (booking: ICustomBookingInsertable) => {
  // Checking if slot is available
  const slot = (
    await selectSlotsUsingFiltersService({ ids: [booking.slot_id] }, undefined, undefined, {
      date: booking.booking_date.toString(),
    })
  )[0]
  if ("is_available" in slot) {
    if (!slot.is_available) throw new SlotUnavailableErr(booking.booking_date.toString(), booking.slot_id)
  }
  // This should never be triggered
  else {
    throw new Error("'is_available' not in slot for some reason")
  }

  // Handling status
  if (typeof booking.status === "undefined") {
    if (generateDateIgnoringTz() < new Date(`${booking.booking_date}T${slot.end_time}Z`)) booking.status = "RESERVED"
    else booking.status = "EXPIRED"
  }

  if (!isStatusValid(booking.status, slot.end_time, booking.booking_date)) throw new InvalidBookingStatusErr()

  const addedBooking = await db
    .insertInto("booking")
    .values({ ...booking, status: booking.status })
    .returningAll()
    .executeTakeFirstOrThrow()

  logger.debug(`Added booking with booking ID = ${addedBooking.id}`)
  return addedBooking
}

export const getBookingsService = async (
  filters?: IGetBookingsFilters,
  sortOptions?: IGetBookingsSortingParams,
  paging?: IPagingParams,
) => {
  var selectStmt = db
    .selectFrom("booking")
    .leftJoin("slots", "booking.slot_id", "slots.id")
    .leftJoin("users", "booking.user_id", "users.id")
    .leftJoin("facilities", "slots.facility_id", "facilities.id")
    .select([
      "booking.id as id",
      "booking.booking_date",
      "booking.slot_id",
      "booking.status",
      "booking.user_id",
      "users.role",
      "users.email",
      "users.phone_no",
      "users.name as booker_name",
      "slots.start_time",
      "slots.end_time",
      "slots.day",
      "slots.facility_id",
      "facilities.name as facility_name",
    ])

  console.log(filters?.bookingDates)

  // Adding filters
  if (filters) {
    if (filters.bookingDates) {
      selectStmt = selectStmt.where("booking.booking_date", "in", filters.bookingDates)
    }
    if (filters.facilityIds) {
      selectStmt = selectStmt.where("slots.facility_id", "in", filters.facilityIds)
    }
    if (filters.slotIds) {
      selectStmt = selectStmt.where("booking.slot_id", "in", filters.slotIds)
    }
    if (filters.status) {
      selectStmt = selectStmt.where("booking.status", "in", filters.status)
    }
    if (filters.timeRange) {
      if (filters.timeRange.gte)
        selectStmt = selectStmt.where((eb) =>
          eb.or([
            eb("slots.start_time", ">=", filters.timeRange?.gte || "00:00:00"),
            eb("slots.end_time", ">=", filters.timeRange?.gte || "00:00:00"),
          ]),
        )

      if (filters.timeRange.lte)
        selectStmt = selectStmt.where((eb) =>
          eb.or([
            eb("slots.start_time", "<=", filters.timeRange?.lte || "23:59:59"),
            eb("slots.end_time", "<=", filters.timeRange?.lte || "23:59:59"),
          ]),
        )
    }
    if (filters.userIds) {
      selectStmt = selectStmt.where("booking.user_id", "in", filters.userIds)
    }
    if (filters.userRoles) {
      selectStmt = selectStmt.where("users.role", "in", filters.userRoles)
    }
  }

  // Sorting here
  if (sortOptions) {
    selectStmt = selectStmt.orderBy(`${sortOptions.sortBy} ${sortOptions.order || "asc"}`)
  }

  // Applying paging parameters
  if (paging) {
    selectStmt = selectStmt.offset(paging.index).limit(paging.index)
  }

  const bookings = await selectStmt.execute()

  logger.debug("Ran complex SELECT on bookings")
  return bookings
}

export const getBookingByIdService = async (id: string) => {
  const booking = await db
    .selectFrom("booking")
    .leftJoin("slots", "booking.slot_id", "slots.id")
    .leftJoin("users", "booking.user_id", "users.id")
    .leftJoin("facilities", "slots.facility_id", "facilities.id")
    .select([
      "booking.id as id",
      "booking.booking_date",
      "booking.slot_id",
      "booking.status",
      "booking.user_id",
      "users.role",
      "users.email",
      "users.phone_no",
      "users.name as booker_name",
      "slots.start_time",
      "slots.end_time",
      "slots.day",
      "slots.facility_id",
      "facilities.name as facility_name",
    ])
    .where("booking.id", "=", id)
    .executeTakeFirstOrThrow()

  logger.debug("Retrieved booking with id = " + id)

  return booking
}

export const updateBookingByIdService = async (
  id: string,
  updatedBooking: Updateable<Booking>,
  enforcedUserId?: string,
) => {
  if (Object.keys(updatedBooking).length === 0) throw new EmptyObjectError()

  const bookingInDb = await getBookingByIdService(id)

  // making sure slot at updated date (if any) will be available
  const slotId = updatedBooking.slot_id || bookingInDb.slot_id
  if (updatedBooking.booking_date && typeof updatedBooking.booking_date != "string")
    updatedBooking.booking_date = updatedBooking.booking_date.toISOString().slice(10)
  const date = updatedBooking.booking_date || bookingInDb.booking_date.toString()

  const slotInDb = (
    await selectSlotsUsingFiltersService(
      {
        ids: [slotId],
      },
      undefined,
      undefined,
      {
        date,
      },
    )
  )[0]

  // Check if, if status is provided, is it valid for the booking in question
  if (updatedBooking.status && !isStatusValid(updatedBooking.status, slotInDb.end_time, date))
    throw new InvalidBookingStatusErr()
  // Check if slot is available after new changes (if any)
  if ("is_available" in slotInDb && !slotInDb.is_available) throw new SlotUnavailableErr(date, slotId)

  let updateStmt = db.updateTable("booking").set(updatedBooking).where("booking.id", "=", id)

  // Enforce a user ID when updating
  if (enforcedUserId) updateStmt = updateStmt.where("booking.user_id", "=", enforcedUserId)

  const newBooking = await updateStmt.returningAll().executeTakeFirstOrThrow()

  logger.info(`Updated booking with ID=${bookingInDb.id}`)

  return newBooking
}

export const deleteBookingById = async (id: string) => {
  const deletedBooking = await db.deleteFrom("booking").where("id", "=", id).returning("id").executeTakeFirstOrThrow()

  logger.info("DELETED booking with id = " + id)
  return deletedBooking
}

// HELPER FUNCTIONS START HERE

function isStatusValid(status: BookingStatus, endTime: string, date: Date | string) {
  if (typeof date === "string") date = generateDateIgnoringTz(date)

  const endTimeHour = +endTime.split(":")[0]
  const endTimeMinutes = +endTime.split(":")[1]

  date.setHours(+endTimeHour)
  date.setMinutes(+endTimeMinutes)
  const dateNow = new Date()

  if (status === "RESERVED") {
    if (date < dateNow) return false
  } else if (status === "EXPIRED") {
    if (date >= dateNow) return false
  }

  return true
}
