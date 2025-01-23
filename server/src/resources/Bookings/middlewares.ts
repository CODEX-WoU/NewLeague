import { NextFunction, Request, Response } from "express"
import { UserRole } from "kysely-codegen"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../middlewares/errorResponseMiddleware"
import appConfig from "../../config/appConfig"
import { getBookingsService } from "./services"
import { generateDateIgnoringTz } from "../../util/timeRelated"

/**
 * Only goes to next middleware if the user's role is allowed to book slots at a date that is not today
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const allowedNonSameDayBookingMiddleware = (
  req: Request,
  res: Response<any, { role: UserRole | "SUPERADMIN"; userId: string }>,
  next: NextFunction,
) => {
  if (!res.locals.role)
    return internalServerErrorResponseMiddleware(res, {
      errObj: Error("No `role` field in res.locals"),
      desc: "Error in allowedNonSameDayBooking middleware",
    })

  const nowDate = new Date()
  const todayDateString = nowDate.toDateString()

  // no bookingDate field in body (will be handled during schema validation later) or given date is today's
  if (!req.body.bookingDate || new Date(req.body.bookingDate).toDateString() == todayDateString) return next()

  if (!appConfig.rolesAllowedNonSameDayBooking.includes(res.locals.role))
    return globalErrorResponseMiddleware(req, res, 403, { description: "Not allowed to book not-today slots" })
  else return next()
}

export const checkIfStudentUnderDailyBookingLimitMiddleware = async (
  req: Request,
  res: Response<any, { role: UserRole | "SUPERADMIN"; userId: string }>,
  next: NextFunction,
) => {
  if (!res.locals.role || (res.locals.role != "SUPERADMIN" && !res.locals.userId))
    throw new Error("Response.locals.role or .userId not set")

  try {
    const role = res.locals.role
    const userId = res.locals.userId

    // Rule only applies to student
    if (role != "STUDENT") return next()

    const bookings = await getBookingsService({ bookingDates: [new Date(generateDateIgnoringTz())], userIds: [userId] })
    if (bookings.filter((booking) => booking.status !== "CANCELLED").length >= appConfig.studentDailyBookingLimit)
      return globalErrorResponseMiddleware(req, res, 400, { description: "STUDENT has exhausted daily booking limt" })
    else return next()
  } catch (error) {
    return internalServerErrorResponseMiddleware(res, {
      errObj: error,
      desc: "Error occurred in checkIfStudentUnderDailyBookingLimitMiddleware",
    })
  }
}
