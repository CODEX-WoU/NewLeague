import { Router } from "express"
import { addProgrammesController } from "./controllers"

const programmesRouter = Router()

programmesRouter.post("/multiple", addProgrammesController)

export default programmesRouter
