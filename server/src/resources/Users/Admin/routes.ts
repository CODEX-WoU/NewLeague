import { Router } from "express"
import { getAdminController, getMultipleAdminsControllers } from "./controllers"
import { verifyRoleMiddleware } from "../../Auth/middleware"

const adminRouter = Router()

adminRouter.get("/multiple", verifyRoleMiddleware({ rolesAllowed: ["SUPERADMIN"] }), getMultipleAdminsControllers)
adminRouter.get("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN", "SUPERADMIN"] }), getAdminController)

export default adminRouter
