import { Router } from "express"
import { addMultipleSlotsController, addSlotController } from "./controllers"

const slotsRouter = Router()

slotsRouter.post("/", addSlotController)
slotsRouter.post("/multiple", addMultipleSlotsController)

export default slotsRouter
