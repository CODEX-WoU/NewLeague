import { Router } from "express"
import { allowedNonSameDayBookingMiddleware, checkIfStudentUnderDailyBookingLimitMiddleware } from "./middlewares"
import {
  addBookingController,
  cancelBookingController,
  getBookingsController,
  updateBookingController,
} from "./controllers"
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
bookingsRouter.patch(
  "/:id/cancel",
  verifyRoleMiddleware({ rolesAllowed: ["ADMIN", "SUPERADMIN", "COACH", "STUDENT"] }),
  cancelBookingController,
)
bookingsRouter.patch("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN", "SUPERADMIN"] }), updateBookingController)

export default bookingsRouter
