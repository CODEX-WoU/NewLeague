import { Request, Response } from "express"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../middlewares/errorResponseMiddleware"
import { invalidateOtpService } from "./services"

export const invalidateOtpController = async (req: Request<{ commaSeperatedIds?: string }>, res: Response) => {
  const commaSeperatedIds = req.params.commaSeperatedIds
  try {
    if (!commaSeperatedIds)
      return globalErrorResponseMiddleware(req, res, 400, {
        description: `Mandatory path parameter "commaSeperatedIds" missing from URL`,
      })

    const ids = commaSeperatedIds.split(",")
    const isInvalidateSuccess = await invalidateOtpService(ids)

    if (isInvalidateSuccess) return res.status(204).send()
    else
      return globalErrorResponseMiddleware(req, res, 404, {
        description: `No OTP with id(s), ${ids} exists`,
      })
  } catch (error) {
    return internalServerErrorResponseMiddleware(res, {
      errObj: error,
      desc: "Error occurred in invalidateOtp controller",
    })
  }
}
