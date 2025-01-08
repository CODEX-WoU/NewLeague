import { Router } from "express"
import {
  addAdminController,
  deleteAdminController,
  getAdminController,
  getMultipleAdminsControllers,
} from "./controllers"
import { verifyRoleMiddleware } from "../../Auth/middleware"

const adminRouter = Router()

adminRouter.get("/multiple", verifyRoleMiddleware({ rolesAllowed: ["SUPERADMIN"] }), getMultipleAdminsControllers)
adminRouter.get("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN", "SUPERADMIN"] }), getAdminController)
adminRouter.post("/", verifyRoleMiddleware({ rolesAllowed: ["SUPERADMIN"] }), addAdminController)
adminRouter.delete("/:id", verifyRoleMiddleware({ rolesAllowed: ["SUPERADMIN"] }), deleteAdminController)

export default adminRouter
