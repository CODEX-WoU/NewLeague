import pino from "pino"
import appConfig from "../config/appConfig"

const logger = pino({
  name: appConfig.appName,
  level: "debug",
})

export default logger
