import { Router } from "express"
import { verifyRoleMiddleware } from "../Auth/middleware"
import { invalidateOtpController } from "./controllers"

const otpRoutes = Router()

otpRoutes.patch(
  "/invalidate/:commaSeperatedIds",
  verifyRoleMiddleware({
    rolesAllowed: ["ADMIN", "SUPERADMIN"],
  }),
  invalidateOtpController,
)

export default otpRoutes
