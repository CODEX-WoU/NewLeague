import { Router } from "express"
import programmesRouter from "./Programmes/routes"

const studentRouter = Router()

studentRouter.use("/programmes", programmesRouter)

export default studentRouter
