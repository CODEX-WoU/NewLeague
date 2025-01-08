import { Request, Response } from "express"
import { fetchStudentsRequestBodySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../middlewares/errorResponseMiddleware"
import { deleteStudentByIdService, fetchStudentsService, getStudentByIdService } from "./services"
import { NoResultError } from "kysely"
import { UserRole } from "kysely-codegen"

export const getMultipleStudentsController = async (req: Request, res: Response) => {
  const validateBody = fetchStudentsRequestBodySchema.safeParse(req.body)
  console.log(validateBody.success)
  if (!validateBody.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBody.error.errors,
      description: "Errors in request body schema",
    })

  var pagingMarkers
  if (req.query.startIndex) {
    const { startIndex, limit } = req.query
    const startIndexNumber = +startIndex
    var limitNumber = limit ? +limit : -99

    if (Number.isNaN(startIndexNumber))
      return globalErrorResponseMiddleware(req, res, 400, {
        description: "'startIndex' query parameter should be a number",
      })

    if (Number.isNaN(limitNumber))
      return globalErrorResponseMiddleware(req, res, 400, {
        description: "'limit' optional query parameter should be a number",
      })
    else if ((limitNumber = -99)) limitNumber = 50

    pagingMarkers = { startIndex: startIndexNumber, limit: limitNumber }
  }

  const filters = validateBody.data
  const students = await fetchStudentsService(filters, pagingMarkers)

  return res.status(200).json({
    success: true,
    data: students,
  })
}

export const getStudentByIdController = async (
  req: Request<{ id?: string }>,
  res: Response<any, { role: UserRole | "SUPERADMIN"; userId: string }>,
) => {
  const id = req.params.id
  if (!id) return globalErrorResponseMiddleware(req, res, 400, { description: "No 'id' path parameter in URL" })

  try {
    if (res.locals.role === "STUDENT" && res.locals.userId != id)
      return globalErrorResponseMiddleware(req, res, 403, { description: "Not allowed" })

    const student = await getStudentByIdService(id)
    return res.status(200).json({
      success: true,
      data: student,
    })
  } catch (error) {
    if (error instanceof NoResultError)
      return globalErrorResponseMiddleware(req, res, 404, { description: "No STUDENT with id = " + id + " exists" })
    else
      return internalServerErrorResponseMiddleware(res, {
        errObj: error,
        desc: "Error occurred in getStudentById controller",
      })
  }
}

export const deleteStudentByIdController = async (
  req: Request<{ id?: string }>,
  res: Response<any, { userId: string; role: UserRole | "SUPERADMIN" }>,
) => {
  const id = req.params.id
  if (!id) return globalErrorResponseMiddleware(req, res, 400, { description: "No `id` path parameter in URL" })

  try {
    if (res.locals.role === "STUDENT" && id != res.locals.userId)
      return globalErrorResponseMiddleware(req, res, 403, { description: "Not allowed" })

    await deleteStudentByIdService(id)
    return res.status(204).send()
  } catch (error) {
    if (error instanceof NoResultError)
      return globalErrorResponseMiddleware(req, res, 400, { description: `No STUDENT with id=${id} exists` })
    else
      return internalServerErrorResponseMiddleware(res, {
        errObj: error,
        desc: "Error occurred in deleteStudentById controller",
      })
  }
}
