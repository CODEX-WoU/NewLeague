// TODO: configure authorizaiton middleware for all

import { Router } from "express"
import {
  addFacilityController,
  deleteFacilityByIdsController,
  getFacilitiesController,
  updateFacilityController,
} from "./controllers"
import categoriesRouter from "./Categories/routes"

const router = Router()

// Categories routes
router.use("/category", categoriesRouter)

router.patch("/:id", updateFacilityController)
router.delete("/:commaSeperatedIds", deleteFacilityByIdsController)
router.post("/", addFacilityController)
router.get("/", getFacilitiesController)

export default router
