import { Router } from "express"
import { addMultipleSlotsController, addSlotController, getSlotsController, updateSlotController } from "./controllers"
import { verifyRoleMiddleware } from "../Auth/middleware"

const slotsRouter = Router()

slotsRouter.post("/", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), addSlotController)
slotsRouter.post("/search", getSlotsController)
slotsRouter.post("/multiple", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), addMultipleSlotsController)
slotsRouter.patch("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), updateSlotController)

export default slotsRouter
