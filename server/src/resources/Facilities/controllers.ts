import { Request, Response } from "express"
import { addFacilityBodySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../common/errorResponseMiddleware"
import { addFacilityService } from "./services"
import logger from "../../common/logger"

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
      body: insertResult,
    })
  } catch (err) {
    logger.error(err, "Error while adding facility")
    return internalServerErrorResponseMiddleware(res)
  }
}
