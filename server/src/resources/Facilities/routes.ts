// TODO: configure authorizaiton middleware for all

import { Router } from "express"
import {
  addFacilityController,
  deleteFacilityByIdsController,
  getFacilitiesController,
  updateFacilityController,
} from "./controllers"
import categoriesRouter from "./Categories/routes"
import { verifyRoleMiddleware } from "../Auth/middleware"

const router = Router()

// Categories routes
router.use("/category", categoriesRouter)

router.patch("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), updateFacilityController)
router.delete("/:commaSeperatedIds", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), deleteFacilityByIdsController)
router.post("/", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), addFacilityController)
router.get("/", getFacilitiesController)

export default router
