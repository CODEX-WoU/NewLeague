import { Response } from "express"

export const invalidAccessTokenMiddleware = (res: Response) => {
  return res.status(403).json({
    success: false,
    description: "Invalid access token. Forbidden.",
  })
}

export const expiredTokenMiddleware = (res: Response) => {
  return res.status(403).json({
    success: false,
    description: "Token is expired. Forbidden.",
  })
}
