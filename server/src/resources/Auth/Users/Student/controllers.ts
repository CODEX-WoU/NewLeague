import { Request, Response } from "express"
import { studentSignUpSchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../../middlewares/errorResponseMiddleware"
import { addStudentService } from "../../../Student/services"
import { hashPasswordService } from "../services"
import { DatabaseError } from "pg"

export const studentSignUpController = async (req: Request, res: Response) => {
  const validatePayload = studentSignUpSchema.safeParse(req.body)
  if (!validatePayload.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      description: "Invalid request payload schema",
      errors: validatePayload.error.errors,
    })

  try {
    const signUpContent = validatePayload.data

    const hashedPswd = await hashPasswordService(signUpContent.password)

    const addedStudentId = await addStudentService(
      {
        email: signUpContent.email,
        id: signUpContent.id,
        name: signUpContent.name,
        password: hashedPswd,
        role: "STUDENT",
        phone_no: signUpContent.phoneNo,
      },
      { programme_id: signUpContent.programmeId },
    )

    return res.status(201).json({
      success: true,
      data: { id: addedStudentId },
    })
  } catch (err) {
    if (err instanceof DatabaseError && err.message.includes("duplicate"))
      return globalErrorResponseMiddleware(req, res, 400, { description: "Email ID or ID already exists" })

    return internalServerErrorResponseMiddleware(res, { errObj: err, desc: "Error in studentSignUp controller" })
  }
}
