import argon2 from "argon2"
import db from "../../../services/db"
import InvalidCredentialsErr from "../../../common/custom_errors/invalidCredentialsErr"
import { createAccessTokenService } from "../JWT/services"
import appConfig from "../../../config/appConfig"
import logger from "../../../common/logger"
import { NoResultError } from "kysely"

export const hashPasswordService = async (rawPswd: string): Promise<string> => {
  return await argon2.hash(rawPswd)
}

export const verifyPasswordService = async (inputPswd: string, pswdHash: string): Promise<boolean> => {
  return await argon2.verify(pswdHash, inputPswd)
}

/**
 * Authenticates user credentials and provides JWT
 * @param email user-provided email
 * @param password user-provided unhashed password string
 * @returns {Promise<{token: string, expiresAtMs: number, role: string}>} Returns a valid JWT for given user
 */
export const signInUserService = async (
  email: string,
  password: string,
): Promise<{ token: string; expiresAtMs: number }> => {
  if (email === appConfig.superAdminEmail && password === appConfig.superAdminPassword) {
    logger.info("SUPERADMIN successful login")
    return createAccessTokenService({ role: "SUPERADMIN" })
  }
  try {
    const userRecord = await db.selectFrom("users").selectAll().where("email", "ilike", email).executeTakeFirstOrThrow()

    const isPswdValid = await verifyPasswordService(password, userRecord.password)
    if (!isPswdValid) throw new InvalidCredentialsErr()

    const token = createAccessTokenService({ role: userRecord.role, userId: userRecord.id })
    return token
  } catch (error) {
    if (error instanceof NoResultError || error instanceof InvalidCredentialsErr)
      logger.debug("Failed login by email: " + email)
    throw error // rethrow error
  }
}
