import { Insertable, Updateable } from "kysely"
import { OtpFunctionEnum, Otps } from "kysely-codegen"
import db from "../../services/db"
import logger from "../../common/logger"
import { OtpTimestampInvalidErr } from "../../common/custom_errors/otpErr"
import mailTransporter from "../../services/nodemailer"
import nodeMailerConfig from "../../config/nodeMailerAndOtpConfig"

export const addOtpService = async (otp: Insertable<Otps>) => {
  if (new Date(otp.valid_till) < new Date()) throw new OtpTimestampInvalidErr()
  const addedOtp = await db.insertInto("otps").values(otp).returningAll().executeTakeFirstOrThrow()

  logger.debug("Added an OTP with value: " + addedOtp.otp_val)
  return addedOtp
}

export const getOtpByIdService = async (id: string) => {
  const otp = await db.selectFrom("otps").selectAll().where("id", "=", id).executeTakeFirstOrThrow()
  return otp
}

// TODO
export const updateOtpService = async (id: string, updatedOtp: Updateable<Otps>) => {}

export const invalidateOtpService = async (id: string | string[]) => {
  var updateStmt = db.updateTable("otps").set({
    is_used: true,
  })

  if (typeof id === "string") {
    updateStmt = updateStmt.where("id", "=", id)
  } else if (Array.isArray(id)) {
    updateStmt = updateStmt.where("id", "in", id)
  }

  const updateRes = await updateStmt.executeTakeFirstOrThrow()

  if (Number(updateRes.numUpdatedRows) == 0) {
    return false
  } else {
    logger.info(`Otp with id = ${id} was invalidated forcefully`)
    return true
  }
}

/**
 *
 * @param {{value: string, idOrRawValue?: "ID" | "RAW"}} otp otp.value represents the "id" of otp in DB or a raw value
 * @param subject
 * @param toMailAddresses
 * @param additionalBodyText
 * @returns String of email addresses which accepted the email
 */
export const sendOtpService = async (
  otp: { value: string; idOrRawValue: "ID" | "RAW" },
  subject: string,
  toMailAddresses: string[],
  additionalBodyText?: string,
) => {
  const otpToSend = otp.idOrRawValue == "RAW" ? otp.value : (await getOtpByIdService(otp.value)).otp_val

  try {
    const sentMsg = await mailTransporter.sendMail({
      from: `"${nodeMailerConfig.senderName}" <${nodeMailerConfig.user}>`,
      to: toMailAddresses.join(","),
      subject: subject,
      text: `Hi, your OTP is ${otpToSend}.\n${additionalBodyText || ""}`,
    })
    return sentMsg.accepted
  } catch (error) {
    logger.error(error)
    return null
  }
}

/**
 * Checks if an OTP exists with all the given parameters
 * @param otpId
 * @param otpToVerify the value of OTP provided by user
 * @param userId
 * @returns
 */
export const verifyOtpService = async (
  otpId: string,
  otpToVerify: number | string,
  options: { userId?: string; forFunction?: OtpFunctionEnum },
) => {
  var otpSelectStmt = db
    .selectFrom("otps")
    .selectAll()
    .where("otps.id", "=", otpId)
    .where("otps.otp_val", "=", +otpToVerify)
    .where("otps.is_used", "=", false)
    .where("otps.valid_till", ">", new Date())

  // UNTESTED
  if (options.userId)
    otpSelectStmt = otpSelectStmt
      .where("otps.user_id", "=", options.userId)
      .where((eb) =>
        eb.and([
          eb
            .selectFrom("users")
            .select("is_deleted")
            .whereRef("users.id", "=", "otps.user_id")
            .where("is_deleted", "=", false),
        ]),
      )
  if (options.forFunction) otpSelectStmt = otpSelectStmt.where("otps.for_function", "=", options.forFunction)

  const otp = await otpSelectStmt.executeTakeFirstOrThrow()

  logger.info(`Successfully validated OTP with id = ${otpId}`)
  return otp
}
