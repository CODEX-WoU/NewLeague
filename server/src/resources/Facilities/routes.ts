// TODO: configure authorizaiton middleware for all

import { Router } from "express"
import { addFacilityController } from "./controllers"
import categoriesRouter from "./Categories/routes"

const router = Router()

// Categories routes
router.use("/category", categoriesRouter)

router.post("/", addFacilityController)

export default router
