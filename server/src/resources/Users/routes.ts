import { Router } from "express"
import studentRouter from "./Student/routes"

const userRouter = Router()

userRouter.use("/student", studentRouter)

export default userRouter
