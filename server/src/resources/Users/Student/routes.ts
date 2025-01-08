import { Router } from "express"
import programmesRouter from "./Programmes/routes"
import { getMultipleStudentsController, getStudentByIdController } from "./controllers"
import { verifyRoleMiddleware } from "../../Auth/middleware"

const studentRouter = Router()

studentRouter.get("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN", "STUDENT"] }), getStudentByIdController)
studentRouter.get("/", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), getMultipleStudentsController)

studentRouter.use("/programmes", programmesRouter)

export default studentRouter
