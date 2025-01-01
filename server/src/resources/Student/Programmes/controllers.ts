import { Request, Response } from "express"
import { addProgrammesBodySchema, updateProgrammeSchema } from "./zodSchemas"
import {
  globalErrorResponseMiddleware,
  internalServerErrorResponseMiddleware,
} from "../../../middlewares/errorResponseMiddleware"
import {
  addProgrammesService,
  getProgrammeService,
  getProgrammesService,
  updateProgrammesByIdsService,
} from "./services"
import EmptyObjectError from "../../../common/custom_errors/emptyObjectErr"
import { NoResultError } from "kysely"

export const getProgrammeController = async (req: Request<{ id?: string }>, res: Response) => {
  const id = req.params.id
  if (typeof id !== "string")
    return globalErrorResponseMiddleware(req, res, 400, { description: "No 'id' path parameter in URL" })

  try {
    const programme = await getProgrammeService(id)
    return res.status(200).json({
      success: true,
      data: programme,
    })
  } catch (error) {
    if (error instanceof NoResultError)
      return globalErrorResponseMiddleware(req, res, 404, { description: `Programme with id = ${id} not found` })

    return internalServerErrorResponseMiddleware(res, {
      errObj: error,
      desc: "Error occurred in getProgrammeController",
    })
  }
}

export const getProgrammesController = async (
  req: Request<any, any, any, { commaSeperatedIds?: string }>,
  res: Response,
) => {
  try {
    var programmes
    if (req.query.commaSeperatedIds) {
      const ids = req.query.commaSeperatedIds.split(",")
      programmes = await getProgrammesService(ids)
    } else programmes = await getProgrammesService()

    return res.status(200).json({
      success: true,
      data: programmes,
    })
  } catch (error) {
    return internalServerErrorResponseMiddleware(res, {
      errObj: error,
      desc: "Error occurred in getProgrammesController",
    })
  }
}

export const addProgrammesController = async (req: Request, res: Response) => {
  const validateBody = addProgrammesBodySchema.safeParse(req.body)
  if (!validateBody.success)
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBody.error.errors,
      description: "Erros in request body schema",
    })

  try {
    const programmesToAdd = validateBody.data
    const idsOfAddedProgrammes = await addProgrammesService(programmesToAdd)

    return res.status(201).json({ success: true, data: { ids: idsOfAddedProgrammes } })
  } catch (error) {
    return internalServerErrorResponseMiddleware(res, {
      errObj: error,
      desc: "Error occurred in addProgrammesController",
    })
  }
}

export const updateMultipleProgrammesController = async (
  req: Request<any, any, any, { commaSeperatedIds?: string }>,
  res: Response,
) => {
  if (typeof req.query.commaSeperatedIds !== "string") {
    return globalErrorResponseMiddleware(req, res, 400, { description: "No 'commaSeperatedIds' query parameter" })
  }

  const idList = req.query.commaSeperatedIds.split(",")

  const validateBody = updateProgrammeSchema.safeParse(req.body)
  if (!validateBody.success) {
    return globalErrorResponseMiddleware(req, res, 400, {
      errors: validateBody.error.errors,
      description: "Errors in request body schema",
    })
  }
  try {
    const newProgrammeDetails = validateBody.data

    const updatedProgrammes = await updateProgrammesByIdsService(idList, newProgrammeDetails)
    return res.status(200).json({
      success: true,
      data: updatedProgrammes,
    })
  } catch (error) {
    if (error instanceof EmptyObjectError) {
      return globalErrorResponseMiddleware(req, res, 400, { description: "Payload is empty/has no valid keys" })
    }
    return internalServerErrorResponseMiddleware(res, { errObj: error, desc: "Internal Server Error" })
  }
}
