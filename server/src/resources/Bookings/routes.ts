import { Router } from "express"
import { allowedNonSameDayBookingMiddleware, checkIfStudentUnderDailyBookingLimitMiddleware } from "./middlewares"
import { addBookingController, getBookingsController } from "./controllers"
import { verifyRoleMiddleware } from "../Auth/middleware"

const bookingsRouter = Router()

bookingsRouter.post(
  "/search",
  verifyRoleMiddleware({ rolesAllowed: ["ADMIN", "COACH", "STUDENT", "SUPERADMIN"] }),
  getBookingsController,
)
bookingsRouter.post(
  "/",
  verifyRoleMiddleware({ rolesAllowed: ["ADMIN", "COACH", "STUDENT", "SUPERADMIN"] }),
  allowedNonSameDayBookingMiddleware,
  checkIfStudentUnderDailyBookingLimitMiddleware,
  addBookingController,
)

export default bookingsRouter
