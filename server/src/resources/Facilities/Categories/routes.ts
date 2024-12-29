import { Router } from "express"
import {
  addFacilityCategoryController,
  deleteFacilityCategoryController,
  getFacilityCategoriesController,
  updateFacilityCategoryController,
} from "./controllers"

const categoriesRouter = Router()

categoriesRouter.post("/", addFacilityCategoryController)
categoriesRouter.get("/", getFacilityCategoriesController)
categoriesRouter.patch("/:id", updateFacilityCategoryController)
categoriesRouter.delete("/:id", deleteFacilityCategoryController)

export default categoriesRouter
