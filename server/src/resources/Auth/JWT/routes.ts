import { Router } from "express"
import { rotateKeyController } from "./controllers"

const router = Router()

router.get("/rotate", rotateKeyController)

export default router
