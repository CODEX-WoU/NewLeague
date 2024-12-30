import { Request, Response } from "express"
import { rotateTokenService } from "./services"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../middlewares/errorResponseMiddleware"
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"

export function rotateKeyController(req: Request, res: Response) {
  const accessToken = req.query.accessToken
  if (!accessToken)
    return globalErrorResponseMiddleware(req, res, 400, {
      description: "No `accessToken` mandatory query parameter in URL",
    })

  try {
    const rotatedTokenDetails = rotateTokenService(accessToken.toString())

    return res.status(400).json({ success: true, data: rotatedTokenDetails })
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return globalErrorResponseMiddleware(req, res, 401, { description: "access token is expired" })
    else if (error instanceof JsonWebTokenError)
      return globalErrorResponseMiddleware(req, res, 401, {
        description: "Erros in provided accessToken",
        errors: error.message,
      })
    else
      return internalServerErrorResponseMiddleware(res, {
        errObj: error,
        desc: "Error occurred in rotateKeyController",
      })
  }
}
