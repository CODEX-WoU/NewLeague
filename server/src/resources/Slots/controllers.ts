import { Request, Response } from "express"
import { addSlotRequestBodySchema, updateSlotRequestBodySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../middlewares/errorResponseMiddleware"
import { addMultipleSlotsService, addSlotService, updateSlotByIdService } from "./services"
import { ConflictingSlotErr } from "../../common/custom_errors/slotErr"
import { NoResultError } from "kysely"
import EmptyObjectError from "../../common/custom_errors/emptyObjectErr"
import { z } from "zod"

export const addSlotController = async (req: Request, res: Response) => {
  const validationResults = addSlotRequestBodySchema.safeParse(req.body)
  if (!validationResults.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validationResults.error.errors,
      description: "Errors in request body schema",
    })

  const newSlot = validationResults.data

  try {
    const addedSlot = await addSlotService(newSlot)
    return res.status(201).json({
      success: true,
      data: addedSlot,
    })
  } catch (error) {
    if (error instanceof ConflictingSlotErr)
      return globalErrorResponseMiddleware(req, res, 409, {
        description: "Slot conflicts timing with a slot with same facilityId and day",
      })
    else return internalServerErrorResponseMiddleware(res, { errObj: error, desc: "Error in addSlotController" })
  }
}

export const addMultipleSlotsController = async (req: Request, res: Response) => {
  const validationResults = addSlotRequestBodySchema.array().safeParse(req.body)
  if (!validationResults.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validationResults.error.errors,
      description: "Errors in request body schema",
    })

  try {
    const newSlots = validationResults.data
    const slotIds = (await addMultipleSlotsService(newSlots)).map((val) => val.id)
    return res.status(201).json({
      success: true,
      data: { ids: slotIds },
    })
  } catch (error) {
    if (error instanceof ConflictingSlotErr)
      return globalErrorResponseMiddleware(req, res, 409, {
        description: "One or more slot conflicts timing with a slot with same facilityId and day",
      })
    else return internalServerErrorResponseMiddleware(res, { errObj: error, desc: "Error in addSlotController" })
  }
}

export const updateSlotController = async (req: Request<{ id?: string }>, res: Response) => {
  const validationResults = updateSlotRequestBodySchema.safeParse(req.body)
  if (!validationResults.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validationResults.error.errors,
      description: "Errors in request body schema",
    })

  const id = req.params.id
  if (!id || !z.string().uuid().safeParse(id).success)
    return globalErrorResponseMiddleware(req, res, 400, {
      description: "No 'id' mandatory query parameter in URL or value is not valid UUID",
    })

  try {
    const updatedSlot = await updateSlotByIdService(id, validationResults.data)
    return res.status(200).json({
      success: true,
      data: updatedSlot,
    })
  } catch (err) {
    if (err instanceof ConflictingSlotErr)
      return globalErrorResponseMiddleware(req, res, 409, {
        description: "One or more slot conflicts timing with a slot with same facilityId and day",
      })
    else if (err instanceof NoResultError)
      return globalErrorResponseMiddleware(req, res, 400, { description: `No slot with id=${id} found` })
    else if (err instanceof EmptyObjectError)
      return globalErrorResponseMiddleware(req, res, 400, { description: "Update object has no valid keys (is empty)" })
    else return internalServerErrorResponseMiddleware(res, { errObj: err, desc: "Error in updateSlot controller" })
  }
}
