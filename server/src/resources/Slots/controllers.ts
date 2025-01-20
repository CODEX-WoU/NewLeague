import { Request, Response } from "express"
import { addSlotRequestBodySchema, getSlotsSchema, updateSlotRequestBodySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../middlewares/errorResponseMiddleware"
import {
  addMultipleSlotsService,
  addSlotService,
  deleteSlotByIdService,
  selectSlotsUsingFiltersService,
  updateSlotByIdService,
} from "./services"
import { ConflictingSlotErr } from "../../common/custom_errors/slotErr"
import { NoResultError } from "kysely"
import EmptyObjectError from "../../common/custom_errors/emptyObjectErr"
import { z } from "zod"
import { isStringPositiveInteger } from "../../util/parsing"

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
        description:
          "Slot conflicts timing with a slot with same facilityId and day OR facility has less courts than court capacity in slot",
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
        description:
          "One or more slot conflicts timing with a slot with same facilityId and day OR facility does not allow given number of courts for slot",
      })
    else return internalServerErrorResponseMiddleware(res, { errObj: error, desc: "Error in addSlotController" })
  }
}

export const getSlotsController = async (req: Request, res: Response) => {
  try {
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

    const bodyValidation = getSlotsSchema.safeParse(req.body)
    if (!bodyValidation.success)
      return globalErrorResponseMiddleware(req, res, 400, {
        errors: bodyValidation.error.errors,
        description: "Erros in request payload schema",
      })

    const filtersAndSorters = bodyValidation.data
    const slots = await selectSlotsUsingFiltersService(filtersAndSorters.filters, filtersAndSorters.sort, paging)

    return res.status(200).json({
      success: true,
      data: slots,
    })
  } catch (error) {
    return internalServerErrorResponseMiddleware(res, { errObj: error, desc: "Error in getSlots controller" })
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
        description:
          "One or more slot conflicts timing with a slot with same facilityId and day OR number of courts entered is more than allowed by facility",
      })
    else if (err instanceof NoResultError)
      return globalErrorResponseMiddleware(req, res, 400, { description: `No slot with id=${id} found` })
    else if (err instanceof EmptyObjectError)
      return globalErrorResponseMiddleware(req, res, 400, { description: "Update object has no valid keys (is empty)" })
    else return internalServerErrorResponseMiddleware(res, { errObj: err, desc: "Error in updateSlot controller" })
  }
}

export const deleteSlotController = async (req: Request<{ id?: string }>, res: Response) => {
  const id = req.params.id
  try {
    if (typeof id !== "string" || !z.string().uuid().safeParse(id).success) {
      return globalErrorResponseMiddleware(req, res, 400, {
        description: "mandatory path parameter `id` should be a UUID",
      })
    }

    await deleteSlotByIdService(id)
    return res.status(204).send()
  } catch (error) {
    if (error instanceof NoResultError)
      return globalErrorResponseMiddleware(req, res, 404, { description: `No slot with id=${id} found` })

    return internalServerErrorResponseMiddleware(res, { errObj: error, desc: "Error occurred in deleteSlotController" })
  }
}
