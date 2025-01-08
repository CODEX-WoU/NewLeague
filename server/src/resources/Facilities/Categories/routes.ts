import { Router } from "express"
import {
  addFacilityCategoryController,
  deleteFacilityCategoryController,
  getFacilityCategoriesController,
  updateFacilityCategoryController,
} from "./controllers"
import { verifyRoleMiddleware } from "../../Auth/middleware"

const categoriesRouter = Router()

categoriesRouter.post("/", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), addFacilityCategoryController)
categoriesRouter.get("/", getFacilityCategoriesController)
categoriesRouter.patch("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), updateFacilityCategoryController)
categoriesRouter.delete("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), deleteFacilityCategoryController)

export default categoriesRouter
