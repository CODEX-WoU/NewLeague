import { Router } from "express"
import facilitiesRouter from "../resources/Facilities/routes"
import authRouter from "../resources/Auth/routes"
import userRouter from "../resources/Users/routes"

const router: Router = Router()

// import routes
router.use("/facility", facilitiesRouter)
router.use("/auth", authRouter)
router.use("/user", userRouter)

export default router
