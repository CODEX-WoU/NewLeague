import { Router } from "express"
import programmesRouter from "./Programmes/routes"
import { getMultipleStudentsController, getStudentByIdController } from "./controllers"

const studentRouter = Router()

studentRouter.get("/:id", getStudentByIdController)
studentRouter.get("/", getMultipleStudentsController)

studentRouter.use("/programmes", programmesRouter)

export default studentRouter
