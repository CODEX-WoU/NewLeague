import { Router } from "express"
import {
  addProgrammesController,
  getProgrammeController,
  getProgrammesController,
  updateMultipleProgrammesController,
} from "./controllers"

const programmesRouter = Router()

programmesRouter.get("/:id", getProgrammeController)
programmesRouter.get("/", getProgrammesController)
programmesRouter.post("/multiple", addProgrammesController)
programmesRouter.patch("/", updateMultipleProgrammesController)

export default programmesRouter
