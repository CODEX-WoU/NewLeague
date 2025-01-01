import { Request, Response } from "express"
import { addFacilityBodySchema, getFacilitiesQuerySchema, updateFacilityBodySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../middlewares/errorResponseMiddleware"
import {
  addFacilityService,
  deleteFacilityByIdsService,
  getFacilitiesService,
  updateFacilityByIdService,
} from "./services"
import logger from "../../common/logger"
import { NoResultError } from "kysely"
import EmptyObjectError from "../../common/custom_errors/emptyObjectErr"

export const getFacilitiesController = async (req: Request, res: Response) => {
  const validateBody = getFacilitiesQuerySchema.safeParse(req.query)
  if (!validateBody.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBody.error.errors,
      description: "Errors in request body schema",
    })

  try {
    const selectFilters = validateBody.data
    const facilities = await getFacilitiesService(selectFilters)
    return res.status(200).json({
      success: true,
      data: facilities,
    })
  } catch (error) {
    logger.error(error, "Error occurred while selecting facilities")
    return internalServerErrorResponseMiddleware(res)
  }
}

export const addFacilityController = async (req: Request, res: Response) => {
  // validating the body
  const validateBody = await addFacilityBodySchema.safeParseAsync(req.body)
  if (!validateBody.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBody.error.errors,
      description: "Errors in request body schema",
    })

  const validatedBody = validateBody.data
  try {
    const insertResult = await addFacilityService({
      name: validatedBody.name,
      number_of_courts: validatedBody.numberOfCourts,
      capacity_per_court: validatedBody.capacityPerCourt,
      category_id: validatedBody.categoryId,
      cover_image_url: validatedBody.coverImageUrl,
      description: validatedBody.description,
      extra_image_urls: validatedBody.extraImageUrls,
    })

    return res.status(201).json({
      success: true,
      data: insertResult,
    })
  } catch (err) {
    logger.error(err, "Error while adding facility")
    return internalServerErrorResponseMiddleware(res)
  }
}
export const updateFacilityController = async (req: Request<{ id?: string }>, res: Response) => {
  const validateBody = await updateFacilityBodySchema.safeParseAsync(req.body)
  if (validateBody.success == false)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBody.error.errors,
      description: "Errors in request body schema",
    })
  else if (typeof req.params.id !== "string" || req.params.id == "") {
    return globalErrorResponseMiddleware(req, res, 400, { description: "No 'id' parameter in URL" })
  }

  try {
    const updateBody = validateBody.data
    const updationResults = await updateFacilityByIdService(req.params.id, updateBody)

    return res.status(200).json({
      success: true,
      data: updationResults,
    })
  } catch (err) {
    if (err instanceof NoResultError)
      return globalErrorResponseMiddleware(req, res, 404, {
        description: "No record with id = " + req.params.id + " found. Does it actually exist?",
      })
    else if (err instanceof EmptyObjectError)
      return globalErrorResponseMiddleware(req, res, 400, { description: "Payload cannot be empty" })
    else return internalServerErrorResponseMiddleware(res, { errObj: err, desc: "Error in updateFacility controller" })
  }
}

export const deleteFacilityByIdsController = async (req: Request<{ commaSeperatedIds?: string }>, res: Response) => {
  const ids = req.params.commaSeperatedIds
  if (typeof ids != "string")
    return globalErrorResponseMiddleware(req, res, 400, { description: "No 'commaSeperatedIds' path param in url" })

  try {
    const idList = ids.split(",")
    const deletedRecords = await deleteFacilityByIdsService(idList)

    return res.status(200).json({ success: true, data: { deletedRecords } })
  } catch (err) {
    return internalServerErrorResponseMiddleware(res, {
      errObj: err,
      desc: "Error occurred in deleteFacilityByIdsController",
    })
  }
}
