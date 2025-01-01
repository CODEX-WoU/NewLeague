import { Router } from "express"
import { addProgrammesController, updateMultipleProgrammesController } from "./controllers"

const programmesRouter = Router()

programmesRouter.post("/multiple", addProgrammesController)
programmesRouter.patch("/", updateMultipleProgrammesController)

export default programmesRouter
