import { Request, Response } from "express"

export const globalErrorResponseMiddleware = (
  _: Request,
  res: Response,
  statusCode: number,
  errorBody?: { errors?: Record<string, any> | string; description?: string },
) => {
  return res.status(statusCode).json({
    success: false,
    ...(errorBody?.description && { description: errorBody.description }),
    ...(errorBody?.errors && { errors: errorBody.errors }),
  })
}

export const internalServerErrorResponseMiddleware = (res: Response) => {
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  })
}
