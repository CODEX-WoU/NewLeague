import { Router } from "express"
import {
  addMultipleSlotsController,
  addSlotController,
  deleteSlotController,
  getSlotsController,
  updateSlotController,
} from "./controllers"
import { verifyRoleMiddleware } from "../Auth/middleware"

const slotsRouter = Router()

slotsRouter.post("/search", getSlotsController)
slotsRouter.post("/", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), addSlotController)
slotsRouter.post("/multiple", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), addMultipleSlotsController)
slotsRouter.patch("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), updateSlotController)
slotsRouter.delete("/:id", verifyRoleMiddleware({ rolesAllowed: ["ADMIN"] }), deleteSlotController)

export default slotsRouter
