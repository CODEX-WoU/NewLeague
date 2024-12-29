import { Router } from "express"
import facilitiesRouter from "../resources/Facilities/routes"

const router: Router = Router()

// import routes
router.use("/facility", facilitiesRouter)

export default router
