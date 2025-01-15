import { Request, Response } from "express"
import { addSlotRequestBodySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../middlewares/errorResponseMiddleware"
import { addMultipleSlotsService, addSlotService } from "./services"
import { ConflictingSlotErr } from "../../common/custom_errors/slotErr"

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
