import { Request, Response } from "express"
import { addFacilityBodySchema, getFacilitiesQuerySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../middlewares/errorResponseMiddleware"
import { addFacilityService, getFacilitiesService } from "./services"
import logger from "../../common/logger"

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
