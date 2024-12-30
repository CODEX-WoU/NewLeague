import pino from "pino"
import appConfig from "../config/appConfig"

const logger = pino({
  name: appConfig.appName,
  level: appConfig.loggingLevel,
})

export default logger
