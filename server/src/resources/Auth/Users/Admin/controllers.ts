import { Request, Response } from "express"
import { adminSignUpBodySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../../middlewares/errorResponseMiddleware"
import { randomUUID } from "crypto"
import { addAdminService } from "../../../Users/Admin/services"
import { hashPasswordService } from "../services"
import { DatabaseError } from "pg"

export const adminSignUpController = async (req: Request, res: Response) => {
  const validateBodyResults = adminSignUpBodySchema.safeParse(req.body)
  if (!validateBodyResults.success) {
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBodyResults.error.errors,
      description: "Errors in request payload schema",
    })
  }

  const adminDetails = validateBodyResults.data
  try {
    const uuid = randomUUID()
    const hashedPassword = await hashPasswordService(adminDetails.password)
    adminDetails.password = hashedPassword

    const admin = await addAdminService({ ...adminDetails, id: uuid })

    return res.status(201).json({
      success: true,
      data: { ...admin, password: undefined },
    })
  } catch (error) {
    if (error instanceof DatabaseError && error.message.includes("duplicate"))
      return globalErrorResponseMiddleware(req, res, 400, { description: `account with same email exists` })

    return internalServerErrorResponseMiddleware(res, {
      errObj: error,
      desc: "Error occurred in adminSignUp controller",
    })
  }
}
