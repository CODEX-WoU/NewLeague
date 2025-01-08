import { Router } from "express"
import studentAuthRouter from "./Student/routes"
import { signInController } from "./controllers"

const userRouter = Router()

userRouter.post("/signin", signInController)

userRouter.use("/student", studentAuthRouter)

export default userRouter
