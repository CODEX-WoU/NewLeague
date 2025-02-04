import { Router } from "express"
import studentAuthRouter from "./Student/routes"
import { signInController } from "./controllers"

const userRouter = Router()

userRouter.use("/student", studentAuthRouter)
userRouter.post("/signin", signInController)

export default userRouter
