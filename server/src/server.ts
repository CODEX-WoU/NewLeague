import app from "./app"
import * as os from "os"
import logger from "./common/logger"

// to use env variables
import "./common/env"
import appConfig from "./config/appConfig"
import { verifySmtpConnection } from "./services/nodemailer"

const PORT = appConfig.port

verifySmtpConnection()

app.listen(PORT, () => {
  logger.info(`up and running in ${appConfig.nodeEnv} @: ${os.hostname()} on port ${PORT}`)
})
