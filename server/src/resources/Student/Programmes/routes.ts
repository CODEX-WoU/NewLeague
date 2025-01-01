import { Router } from "express"
import {
  addProgrammesController,
  deleteMultipleProgrammesByIdController,
  deleteProgrammeByIdController,
  getProgrammeController,
  getProgrammesController,
  updateMultipleProgrammesController,
} from "./controllers"

const programmesRouter = Router()

programmesRouter.get("/", getProgrammesController)
programmesRouter.get("/:id", getProgrammeController)

programmesRouter.post("/multiple", addProgrammesController)

programmesRouter.patch("/", updateMultipleProgrammesController)

programmesRouter.delete("/multiple", deleteMultipleProgrammesByIdController)
programmesRouter.delete("/:id", deleteProgrammeByIdController)

export default programmesRouter
