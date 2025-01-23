import "../common/env"

/**
 * Config object containing parameters for initializing nodemailer transporter
 */
export default {
  host: process.env.SMTP_HOST || "SMTP_HOST NOT SET",
  port: Number(process.env.SMTP_PORT) || -1,
  user: process.env.SMTP_USER || "SMTP_USER not set",
  password: process.env.SMTP_PASSWORD || "SMTP_PASSWORD NOT SET",
}
