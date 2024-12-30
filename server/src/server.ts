import app from "./app"
import * as os from "os"
import logger from "./common/logger"
import mongodb from "./services/db"

// to use env variables
import "./common/env"
import appConfig from "./config/appConfig"

const PORT = appConfig.port

app.listen(PORT, () => {
  logger.info(`up and running in ${appConfig.nodeEnv} @: ${os.hostname()} on port ${PORT}`)
})
