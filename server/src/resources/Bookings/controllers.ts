import { Request, Response } from "express"
import { UserRole } from "kysely-codegen"
import { addBookingRequestBodySchema, getBookingsSchema, updateBookingSchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../middlewares/errorResponseMiddleware"
import { addBookingService, getBookingsService, updateBookingByIdService } from "./services"
import { SlotUnavailableErr } from "../../common/custom_errors/bookingErr"
import { isStringPositiveInteger } from "../../util/parsing"
import { InvalidBookingStatusErr } from "../../common/custom_errors/bookingErr"
import { z } from "zod"
import { NoResultError } from "kysely"
import EmptyObjectError from "../../common/custom_errors/emptyObjectErr"

export const addBookingController = async (
  req: Request,
  res: Response<any, { userId: string | undefined; role: UserRole | "SUPERADMIN" }>,
) => {
  const validationResults = addBookingRequestBodySchema.safeParse(req.body)
  if (!validationResults.success) {
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validationResults.error.errors,
      description: "Error in request body schema",
    })
  }

  try {
    const newBooking = validationResults.data

    const { userId, role } = res.locals
    if (
      !(role === "ADMIN" || role === "SUPERADMIN") &&
      typeof newBooking.user_id == "string" &&
      userId != newBooking.user_id
    ) {
      return globalErrorResponseMiddleware(req, res, 403, {
        description: "Not allowed to book with userId other than your account's",
      })
    }

    if (!(role === "ADMIN" || role === "SUPERADMIN") && newBooking.status) {
      return globalErrorResponseMiddleware(req, res, 403, { description: "Not allowed to add booking with status" })
    }

    if (role === "SUPERADMIN" && !newBooking.user_id)
      return globalErrorResponseMiddleware(req, res, 400, {
        description: "SUPERADMIN must include userId field in payload",
      })

    if (!newBooking.user_id) newBooking.user_id = userId

    const addedBooking = await addBookingService({ ...newBooking, user_id: newBooking.user_id! })
    return res.status(201).json({
      success: true,
      data: addedBooking,
    })
  } catch (error) {
    if (error instanceof SlotUnavailableErr) {
      return globalErrorResponseMiddleware(req, res, 400, {
        description: "Given slot is unavailable to be booked right now",
      })
    } else if (error instanceof InvalidBookingStatusErr) {
      return globalErrorResponseMiddleware(req, res, 400, {
        description: "Provided status is invalid",
      })
    } else {
      return internalServerErrorResponseMiddleware(res, {
        errObj: error,
        desc: "Error occurred in addBookingController",
      })
    }
  }
}

export const getBookingsController = async (
  req: Request,
  res: Response<any, { userId: string | undefined; role: UserRole | "SUPERADMIN" }>,
) => {
  // Getting valid request schema
  const validationResults = getBookingsSchema.safeParse(req.body)
  if (!validationResults.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validationResults.error.errors,
      description: "Errors in request body schema",
    })
  const options = validationResults.data
  if (!options.filters) options.filters = {}

  // Extracting paging parameters
  let { index, limit } = req.query as { index: string | number | undefined; limit: string | number | undefined }
  if (index && !isStringPositiveInteger(index))
    return globalErrorResponseMiddleware(req, res, 400, {
      description: "Query parameter 'index' is not a valid integer",
    })

  if (limit && !isStringPositiveInteger(limit)) {
    return globalErrorResponseMiddleware(req, res, 400, {
      description: "Query parameter 'index' is not a valid integer",
    })
  }

  index = index ? parseInt(index as string) : limit ? 0 : undefined
  limit = limit ? parseInt(limit as string) : index ? 30 : undefined
  const paging = index !== undefined && limit !== undefined ? { index, limit } : undefined

  // Verifying parameters are ok for user
  const { userId, role } = res.locals
  if (!role || (role != "SUPERADMIN" && !userId))
    throw new Error("role not set OR role not SUPERADMIN but userId missing in Response.locals object")

  // Non-admin roles should only be able to see their own bookings
  if (!(role === "ADMIN" || role === "SUPERADMIN")) {
    options.filters.userIds = [userId!]
    delete options.filters.userRoles
  }

  const bookings = await getBookingsService(options.filters, options.sort, paging)
  return res.status(200).json({
    success: true,
    data: bookings,
  })
}

export const updateBookingController = async (req: Request, res: Response<any, { role: UserRole | "SUPERADMIN" }>) => {
  const id = req.params.id
  try {
    if (!id || !z.string().uuid().safeParse(id))
      return globalErrorResponseMiddleware(req, res, 400, {
        description: `Mandatory "id" path parameter not a valid UUID or missing`,
      })

    const bodyValidationResults = updateBookingSchema.safeParse(req.body)
    if (!bodyValidationResults.success)
      return globalErrorResponseMiddleware(req, res, 400, {
        errors: bodyValidationResults.error.errors,
        description: "Errors in request body schema",
      })

    const updateable = bodyValidationResults.data

    const updateResult = await updateBookingByIdService(id, updateable)
    return res.status(200).json({
      success: true,
      data: updateResult,
    })
  } catch (error) {
    if (error instanceof NoResultError) {
      return globalErrorResponseMiddleware(req, res, 404, { description: `No booking with id=${id} found` })
    } else if (error instanceof SlotUnavailableErr) {
      return globalErrorResponseMiddleware(req, res, 409, { description: "Slot is unavailable" })
    } else if (error instanceof EmptyObjectError) {
      return globalErrorResponseMiddleware(req, res, 400, { description: "Update payload cannot be empty" })
    } else if (error instanceof InvalidBookingStatusErr) {
      return globalErrorResponseMiddleware(req, res, 400, {
        description: "Given status is invalid for current state given booking",
      })
    } else {
      return internalServerErrorResponseMiddleware(res, {
        errObj: error,
        desc: "Error occurred in updateBookingController",
      })
    }
  }
}
