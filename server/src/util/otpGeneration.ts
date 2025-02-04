import nodeMailerAndOtpConfig from "../config/nodeMailerAndOtpConfig"

export const generateRandomNumbers = (count = 6) => {
  let randomNumbers = []
  for (let i = 0; i < count; i++) {
    randomNumbers.push(Math.floor(Math.random() * 10))
  }
  return randomNumbers.join("")
}

export const getOtpValidTillDate = () => {
  const now = new Date()
  const futureDate = new Date(now.getTime() + nodeMailerAndOtpConfig.otpExpiresAtInMinutes * 60 * 1000)
  return futureDate
}
