import { Router } from "express"
import studentAuthRouter from "./Student/routes"

const userRouter = Router()

userRouter.use("/student", studentAuthRouter)

export default userRouter
