import { Router } from "express"
import { addMultipleSlotsController, addSlotController, updateSlotController } from "./controllers"

const slotsRouter = Router()

slotsRouter.post("/", addSlotController)
slotsRouter.post("/multiple", addMultipleSlotsController)
slotsRouter.patch("/:id", updateSlotController)

export default slotsRouter
