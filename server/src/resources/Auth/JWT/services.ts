import appConfig from "../../../config/appConfig"
import { IJWTCreationCustomParameters, IJWTPayload } from "./interfaces"
import jwt from "jsonwebtoken"

export const createAccessTokenService = (customParams: IJWTCreationCustomParameters) => {
  const tokenPayload = {
    role: customParams.role,
    ...(customParams.role != "SUPERADMIN" && { userId: customParams?.userId }),
  }

  const token = jwt.sign(tokenPayload, appConfig.jwtPrivateKey, {
    algorithm: "HS256",
    expiresIn: appConfig.jwtExpiresInMS / 1000, // Divide by 1000 because expiresIn needs to take a value in seconds
  })

  return { token, expiresAtMs: Date.now() + appConfig.jwtExpiresInMS }
}

/**
 * Validates given JWT token
 * @param accessToken JWT Token to validate
 * @returns The validated body of the token
 *
 * @throws {TokenExpiredError}
 * @throws {JsonWebTokenError}
 */
export const getJwtContentService = (accessToken: string): IJWTPayload => {
  const validatedAccessToken = jwt.verify(accessToken, appConfig.jwtPrivateKey) as IJWTPayload
  return validatedAccessToken
}

export function rotateTokenService(accessToken: string) {
  const payload = getJwtContentService(accessToken)
  const newTokenDetails = createAccessTokenService(payload)

  return newTokenDetails
}
