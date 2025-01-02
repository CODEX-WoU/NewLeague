import { Router } from "express"
import jwtRouter from "./JWT/routes"
import userRouter from "./Users/routes"

const router = Router()

router.use("/jwt", jwtRouter)
router.use("/users", userRouter)

export default router
