import "../common/env"

export default {
  port: process.env.PORT,
  requestLimit: process.env.REQUEST_LIMT || "100kb",
  nodeEnv: process.env.NODE_ENV || "development",
  appName: process.env.APP_ID || "app",
  loggingLevel: process.env.LOG_LEVEL || "info",
  dbConnectionString: process.env.DATABASE_URL,

  // JWT related
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY || "Default private key",
  jwtExpiresInMS: 6.048e8, // 1 week in milliseconds

  // Superadmin credentials
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
}
