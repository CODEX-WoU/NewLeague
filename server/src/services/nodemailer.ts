import nodemailer from "nodemailer"
import nodeMailerConfig from "../config/nodeMailerConfig"

const mailTransporter = nodemailer.createTransport({
  host: nodeMailerConfig.host,
  port: nodeMailerConfig.port,
  auth: {
    user: nodeMailerConfig.user,
    pass: nodeMailerConfig.password,
  },
})

export default mailTransporter
