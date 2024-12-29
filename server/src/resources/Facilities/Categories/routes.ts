import { Router } from "express"
import { addFacilityCategoryController } from "./controllers"

const categoriesRouter = Router()

categoriesRouter.post("/", addFacilityCategoryController)

export default categoriesRouter
