import { Request, Response } from "express"
import { signInBodySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../middlewares/errorResponseMiddleware"
import { signInUserService } from "./services"
import { NoResultError } from "kysely"
import InvalidCredentialsErr from "../../../common/custom_errors/invalidCredentialsErr"

export const signInController = async (req: Request, res: Response) => {
  const validateBody = signInBodySchema.safeParse(req.body)
  if (!validateBody.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBody.error.errors,
      description: "Errors in request body schema",
    })

  try {
    const credentials = validateBody.data
    const tokenDetails = await signInUserService(credentials.email, credentials.password)

    return res.status(200).json({
      success: true,
      data: tokenDetails,
    })
  } catch (error) {
    if (error instanceof NoResultError || error instanceof InvalidCredentialsErr) {
      return globalErrorResponseMiddleware(req, res, 401, { description: "Invalid credentials" })
    } else {
      return internalServerErrorResponseMiddleware(res, { errObj: error, desc: "Error in signInController" })
    }
  }
}
