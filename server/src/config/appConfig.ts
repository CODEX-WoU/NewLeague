import "../common/env"

export default {
  port: process.env.PORT,
  requestLimit: process.env.REQUEST_LIMT || "100kb",
  nodeEnv: process.env.NODE_ENV || "development",
  appName: process.env.APP_ID || "app",
  loggingLevel: process.env.LOG_LEVEL || "info",
  dbConnectionString: process.env.DATABASE_URL,
}
