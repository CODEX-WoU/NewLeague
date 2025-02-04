import nodemailer from "nodemailer"
import nodeMailerConfig from "../config/nodeMailerAndOtpConfig"
import logger from "../common/logger"

const mailTransporter = nodemailer.createTransport({
  host: nodeMailerConfig.host,
  port: nodeMailerConfig.port,
  auth: {
    user: nodeMailerConfig.user,
    pass: nodeMailerConfig.password,
  },
})

export const verifySmtpConnection = () => {
  mailTransporter.verify(function (error, success) {
    if (error) {
      logger.error(error, "SMTP connection is down/not working")
    } else {
      logger.info("SMTP connection is working properly ")
    }
  })
}

export default mailTransporter
