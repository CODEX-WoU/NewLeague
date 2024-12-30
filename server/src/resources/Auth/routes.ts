import { Router } from "express"
import jwtRouter from "./JWT/routes"

const router = Router()

router.use("/jwt", jwtRouter)

export default router
