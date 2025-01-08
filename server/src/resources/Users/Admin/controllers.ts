import { Request, Response } from "express"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../middlewares/errorResponseMiddleware"
import { getAdminByIdService } from "./services"
export const getAdminController = async (req: Request<{ id?: string }>, res: Response<any, { userId: string }>) => {
  const id = req.params.id
  if (!id)
    return globalErrorResponseMiddleware(req, res, 400, {
      description: "No `id` path parameter in URL",
    })

  try {
    if (id != res.locals.userId) return globalErrorResponseMiddleware(req, res, 403, { description: "Not allowed" })

    const admin = await getAdminByIdService(id)

    if (admin.length == 0)
      return globalErrorResponseMiddleware(req, res, 404, {
        description: `No admin with id = ${id} exists`,
      })

    return res.status(200).json({
      success: true,
      data: admin,
    })
  } catch (error) {
    return internalServerErrorResponseMiddleware(res, {
      errObj: error,
      desc: "Error occurred in getAdminController",
    })
  }
}

export const getMultipleAdminsControllers = async (
  req: Request<any, any, any, { commaSeperatedIds?: string }>,
  res: Response,
) => {
  const ids = req.query.commaSeperatedIds
  if (!ids)
    return globalErrorResponseMiddleware(req, res, 400, {
      description: "No 'commaSeperatedIds' mandatory query parameter in URL or value is empty",
    })

  try {
    const idList = ids.split(",")

    const admins = await getAdminByIdService(idList)
    return res.status(200).json({
      success: true,
      data: admins,
    })
  } catch (error) {
    return internalServerErrorResponseMiddleware(res, {
      errObj: error,
      desc: "Error occurred in getMultipleAdminsController",
    })
  }
}
