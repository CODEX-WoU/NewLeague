import { Router } from "express"
import studentRouter from "./Student/routes"
import adminRouter from "./Admin/routes"

const userRouter = Router()

userRouter.use("/student", studentRouter)
userRouter.use("/admin", adminRouter)

export default userRouter
