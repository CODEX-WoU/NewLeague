import { Request, Response } from "express"
import { addCategoryZodSchema } from "./zodSchemas"
import { globalErrorResponseMiddleware } from "../../../common/errorResponseMiddleware"
import { addFacilityCategoryService } from "./services"

export const addFacilityCategoryController = async (req: Request, res: Response) => {
  const validateBody = addCategoryZodSchema.safeParse(req.body)

  if (!validateBody.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBody.error.errors,
      description: "Incorrect request schema",
    })

  const categoryToInsert = validateBody.data

  const insertionResult = await addFacilityCategoryService({
    category_name: categoryToInsert.categoryName,
    cover_image_url: categoryToInsert.coverImageUrl,
    description: categoryToInsert.description,
  })

  return res.status(201).json({
    success: true,
    body: insertionResult,
  })
}
