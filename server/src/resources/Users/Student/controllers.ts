import { Request, Response } from "express"
import { fetchStudentsRequestBodySchema, updateStudentRequestBodySchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../middlewares/errorResponseMiddleware"
import {
  deleteStudentByIdService,
  fetchStudentsService,
  getStudentByIdService,
  updateStudentByIdService,
} from "./services"
import { NoResultError } from "kysely"
import { UserRole } from "kysely-codegen"
import { hashPasswordService } from "../../Auth/Users/services"
import { DatabaseError } from "pg"
import EmptyObjectError from "../../../common/custom_errors/emptyObjectErr"

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

export const patchStudentByIdController = async (
  req: Request<{ id?: string }>,
  res: Response<any, { userId: string; role: UserRole | "SUPERADMIN" }>,
) => {
  const validateBodyResults = updateStudentRequestBodySchema.safeParse(req.body)
  if (!validateBodyResults.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBodyResults.error.errors,
      description: "Errors in Request body schema",
    })

  const id = req.params.id
  if (!id) return globalErrorResponseMiddleware(req, res, 400, { description: "No 'id' path parameter in URL" })

  const newDetails = validateBodyResults.data
  if (res.locals.role === "STUDENT" && res.locals.userId != id)
    return globalErrorResponseMiddleware(req, res, 403, { description: "Not allowed" })
  // STUDENT is not allowed to modify their email
  else if (res.locals.role === "STUDENT" && newDetails.email)
    return globalErrorResponseMiddleware(req, res, 403, {
      description: "STUDENT is not allowed to change own email address after signup",
    })

  try {
    if (newDetails.password) newDetails.password = await hashPasswordService(newDetails.password)

    const updatedStudent = await updateStudentByIdService(id, {
      ...(newDetails.email && { email: newDetails.email }),
      ...(newDetails.name && { name: newDetails.name }),
      ...(newDetails.password && { password: newDetails.password }),
      ...(newDetails.phoneNo && { phone_no: newDetails.phoneNo }),
      ...(newDetails.programmeId && { programme_id: newDetails.programmeId }),
    })

    return res.status(200).json({
      success: true,
      data: updatedStudent,
    })
  } catch (error) {
    if (error instanceof NoResultError)
      return globalErrorResponseMiddleware(req, res, 404, { description: `No student with id=${id} exists in DB` })
    else if (error instanceof DatabaseError && error.message.includes("duplicate"))
      return globalErrorResponseMiddleware(req, res, 400, {
        description: "A unique field's value already exists in DB",
      })
    else if (error instanceof EmptyObjectError)
      return globalErrorResponseMiddleware(req, res, 400, {
        description: "Payload does not contain any valid keys",
      })
    else
      return internalServerErrorResponseMiddleware(res, { errObj: error, desc: "Error in patchStudentById controller" })
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
