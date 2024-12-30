import { Router } from "express"
import facilitiesRouter from "../resources/Facilities/routes"
import authRouter from "../resources/Auth/routes"

const router: Router = Router()

// import routes
router.use("/facility", facilitiesRouter)
router.use("/auth", authRouter)

export default router
