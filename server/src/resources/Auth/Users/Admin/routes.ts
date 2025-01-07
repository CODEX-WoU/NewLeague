import { Router } from "express"
import { adminSignUpController } from "./controllers"
import { verifyRoleMiddleware } from "../../middleware"

const adminRouter = Router()

adminRouter.post("/signup", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), adminSignUpController)

export default adminRouter
