import { Request, Response } from "express"
import { addCategoryZodSchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../common/errorResponseMiddleware"
import { addFacilityCategoryService, getFacilityCategoriesService } from "./services"

export const getFacilityCategoriesController = async (req: Request, res: Response) => {
  try {
    const facilityCategories = await getFacilityCategoriesService()
    return res.status(200).json({
      success: true,
      data: facilityCategories,
    })
  } catch (err) {
    return internalServerErrorResponseMiddleware(res, {
      errObj: err,
      desc: "Error occurred in getfacilitycategories controller",
    })
  }
}

export const addFacilityCategoryController = async (req: Request, res: Response) => {
  const validateBody = addCategoryZodSchema.safeParse(req.body)

  if (!validateBody.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBody.error.errors,
      description: "Incorrect request schema",
    })

  try {
    const categoryToInsert = validateBody.data

    const insertionResult = await addFacilityCategoryService({
      category_name: categoryToInsert.categoryName,
      cover_image_url: categoryToInsert.coverImageUrl,
      description: categoryToInsert.description,
    })

    return res.status(201).json({
      success: true,
      data: insertionResult,
    })
  } catch (error) {
    return internalServerErrorResponseMiddleware(res, {
      errObj: error,
      desc: "Error occurred in addFacilityCategory controller",
    })
  }
}
