import { Router } from "express"
import studentAuthRouter from "./Student/routes"
import { signInController } from "./controllers"
import adminRouter from "./Admin/routes"

const userRouter = Router()

userRouter.post("/signin", signInController)

userRouter.use("/student", studentAuthRouter)
userRouter.use("/admin", adminRouter)

export default userRouter
