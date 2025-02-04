import { Router } from "express"
import { studentSignUpController, studentSignUpOtpSubmitController } from "./controllers"

const studentAuthRouter = Router()

studentAuthRouter.post("/signup", studentSignUpController)
studentAuthRouter.post("/signup/otp-submit/:otpId", studentSignUpOtpSubmitController)

export default studentAuthRouter
