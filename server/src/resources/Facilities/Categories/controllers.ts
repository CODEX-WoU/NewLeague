import { Request, Response } from "express"
import { addCategoryZodSchema, updateCategoryZodSchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../middlewares/errorResponseMiddleware"
import { addFacilityCategoryService, getFacilityCategoriesService, updateFacilityCategoryByIdService } from "./services"
import EmptyObjectError from "../../../common/custom_errors/emptyObjectErr"

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

export const updateFacilityCategoryController = async (req: Request<{ id?: string }, any, any>, res: Response) => {
  const validateBody = updateCategoryZodSchema.safeParse(req.body)
  if (!validateBody.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      description: "Incorrect request schema",
      errors: validateBody.error.errors,
    })
  else if (!req.params.id) return globalErrorResponseMiddleware(req, res, 400, { errors: "No 'id' parameter in URL" })
  try {
    const updateBody = validateBody.data

    const updatedCategory = await updateFacilityCategoryByIdService(req.params.id, updateBody)

    return res.status(200).json({
      success: true,
      data: updatedCategory,
    })
  } catch (err) {
    if (err instanceof EmptyObjectError) {
      return globalErrorResponseMiddleware(req, res, 400, {
        description: "Payload object is empty",
      })
    }

    return internalServerErrorResponseMiddleware(res, {
      errObj: err,
      desc: "Error occurred in updateFacilityCategoryById controller",
    })
  }
}
