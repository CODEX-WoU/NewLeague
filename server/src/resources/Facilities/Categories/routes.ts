import { Router } from "express"
import {
  addFacilityCategoryController,
  getFacilityCategoriesController,
  updateFacilityCategoryController,
} from "./controllers"

const categoriesRouter = Router()

categoriesRouter.post("/", addFacilityCategoryController)
categoriesRouter.get("/", getFacilityCategoriesController)
categoriesRouter.patch("/:id", updateFacilityCategoryController)

export default categoriesRouter
