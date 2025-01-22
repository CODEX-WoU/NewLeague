import { Router } from "express"
import facilitiesRouter from "../resources/Facilities/routes"
import authRouter from "../resources/Auth/routes"
import userRouter from "../resources/Users/routes"
import slotsRouter from "../resources/Slots/routes"
import bookingsRouter from "../resources/Bookings/routes"

const router: Router = Router()

// import routes
router.use("/slot", slotsRouter)
router.use("/facility", facilitiesRouter)
router.use("/booking", bookingsRouter)
router.use("/auth", authRouter)
router.use("/user", userRouter)

export default router
