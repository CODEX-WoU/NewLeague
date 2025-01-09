import { Router } from "express"
import programmesRouter from "./Programmes/routes"
import {
  deleteStudentByIdController,
  getMultipleStudentsController,
  getStudentByIdController,
  patchStudentByIdController,
} from "./controllers"
import { verifyRoleMiddleware } from "../../Auth/middleware"

const studentRouter = Router()

studentRouter.get("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN", "STUDENT"] }), getStudentByIdController)
studentRouter.get("/", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), getMultipleStudentsController)
studentRouter.delete("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN", "STUDENT"] }), deleteStudentByIdController)
studentRouter.patch("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN", "STUDENT"] }), patchStudentByIdController)

studentRouter.use("/programmes", programmesRouter)

export default studentRouter
