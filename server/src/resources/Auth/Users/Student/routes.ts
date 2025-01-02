import { Router } from "express"
import { studentSignUpController } from "./controllers"

const studentAuthRouter = Router()

studentAuthRouter.post("/signup", studentSignUpController)

export default studentAuthRouter
