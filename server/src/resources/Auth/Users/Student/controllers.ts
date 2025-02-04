import { Request, Response } from "express"
import { studentSignUpSchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../../middlewares/errorResponseMiddleware"
import { addStudentService } from "../../../Users/Student/services"
import { hashPasswordService } from "../services"
import { DatabaseError } from "pg"
import { addOtpService, sendOtpService, verifyOtpService } from "../../../Otp/services"
import { generateRandomNumbers, getOtpValidTillDate } from "../../../../util/otpGeneration"
import { Insertable, NoResultError } from "kysely"
import { Users } from "kysely-codegen"

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

    const addedOtp = await addOtpService({
      payload: {
        userInfo: {
          email: signUpContent.email,
          uni_id: signUpContent.uniId,
          name: signUpContent.name,
          password: hashedPswd,
          role: "STUDENT",
          phone_no: signUpContent.phoneNo,
        } as Insertable<Users>,
        programme_id: signUpContent.programmeId,
      },
      for_function: "USER_SIGNUP",
      is_used: false,
      otp_val: +generateRandomNumbers(6),
      valid_till: getOtpValidTillDate(),
    })

    sendOtpService({ value: addedOtp.otp_val.toString(), idOrRawValue: "RAW" }, "Sign UP OTP", [signUpContent.email])

    return res.status(201).json({
      success: true,
      data: { otpId: addedOtp.id },
    })
  } catch (err) {
    if (err instanceof DatabaseError && err.message.includes("duplicate"))
      return globalErrorResponseMiddleware(req, res, 400, { description: "Email ID or ID already exists" })

    return internalServerErrorResponseMiddleware(res, { errObj: err, desc: "Error in studentSignUp controller" })
  }
}

export const studentSignUpOtpSubmitController = async (
  req: Request<{ otpId?: string }, any, any, { otp?: string }>,
  res: Response,
) => {
  const otpId = req.params.otpId
  const otp = req.query.otp
  if (!otpId)
    return globalErrorResponseMiddleware(req, res, 400, {
      description: "Mandatory path parameter 'otpId' missing from URL",
    })

  if (!otp)
    return globalErrorResponseMiddleware(req, res, 400, { description: "Mandatory query parameter `otp` missing" })
  if (Number.isNaN(+otp))
    return globalErrorResponseMiddleware(req, res, 400, { description: "query parameter 'otp' should be a number" })

  try {
    const otpPayload: any = (await verifyOtpService(otpId, otp, { forFunction: "USER_SIGNUP" })).payload
    const addedStudentId = await addStudentService(otpPayload.userInfo, { programme_id: otpPayload.programme_id })
    return res.status(201).json({
      success: true,
      data: { id: addedStudentId },
    })
  } catch (error) {
    if (error instanceof NoResultError)
      return globalErrorResponseMiddleware(req, res, 400, { description: "OTP invalid" })
    else if (error instanceof DatabaseError && error.message.includes("duplicate"))
      return globalErrorResponseMiddleware(req, res, 400, { description: "Email ID or ID already exists" })
    else
      return internalServerErrorResponseMiddleware(res, {
        errObj: error,
        desc: "Error occurred in student signup otp submit controller",
      })
  }
}
