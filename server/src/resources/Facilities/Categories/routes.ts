import { Router } from "express"
import { addFacilityCategoryController, getFacilityCategoriesController } from "./controllers"

const categoriesRouter = Router()

categoriesRouter.post("/", addFacilityCategoryController)
categoriesRouter.get("/", getFacilityCategoriesController)

export default categoriesRouter
