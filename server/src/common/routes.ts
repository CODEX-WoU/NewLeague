import { Router } from "express"
import facilitiesRouter from "../resources/Facilities/routes"
import authRouter from "../resources/Auth/routes"
import studentRouter from "../resources/Student/routes"

const router: Router = Router()

// import routes
router.use("/facility", facilitiesRouter)
router.use("/auth", authRouter)
router.use("/student", studentRouter)

export default router
