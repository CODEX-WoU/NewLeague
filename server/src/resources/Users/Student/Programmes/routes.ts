import { Router } from "express"
import {
  addProgrammesController,
  deleteMultipleProgrammesByIdController,
  deleteProgrammeByIdController,
  getProgrammeController,
  getProgrammesController,
  updateMultipleProgrammesController,
} from "./controllers"
import { verifyRoleMiddleware } from "../../../Auth/middleware"

const programmesRouter = Router()

programmesRouter.get("/", getProgrammesController)
programmesRouter.get("/:id", getProgrammeController)

programmesRouter.post("/multiple", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), addProgrammesController)

programmesRouter.patch("/", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), updateMultipleProgrammesController)

programmesRouter.delete(
  "/multiple",
  verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }),
  deleteMultipleProgrammesByIdController,
)
programmesRouter.delete("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), deleteProgrammeByIdController)

export default programmesRouter
