import { Request, Response } from "express"
import { addProgrammesBodySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../middlewares/errorResponseMiddleware"
import { addProgrammesService } from "./services"

export const addProgrammesController = async (req: Request, res: Response) => {
  const validateBody = addProgrammesBodySchema.safeParse(req.body)
  if (!validateBody.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBody.error.errors,
      description: "Erros in request body schema",
    })

  try {
    const programmesToAdd = validateBody.data
    const idsOfAddedProgrammes = await addProgrammesService(programmesToAdd)

    return res.status(201).json({ success: true, data: { ids: idsOfAddedProgrammes } })
  } catch (error) {
    return internalServerErrorResponseMiddleware(res, {
      errObj: error,
      desc: "Error occurred in addProgrammesController",
    })
  }
}
