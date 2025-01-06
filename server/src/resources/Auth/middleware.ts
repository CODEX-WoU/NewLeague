import { NextFunction, Request, Response } from "express"
import { UserRole } from "kysely-codegen"
import {
  expiredTokenMiddleware,
  invalidAccessTokenMiddleware,
} from "../../middlewares/accessTokenRelatedErrorResponsesMiddleware.ts"
import { getJwtContentService } from "./JWT/services"
import { internalServerErrorResponseMiddleware } from "../../middlewares/errorResponseMiddleware"
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"

export function verifyRoleMiddleware(options: { rolesAllowed: ("SUPERADMIN" | UserRole)[] }) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const rolesAllowed = options.rolesAllowed

    // Adding SUPERADMIN if ADMIN is present in rolesAllowed list
    if (rolesAllowed.includes("ADMIN") && !rolesAllowed.includes("SUPERADMIN")) rolesAllowed.push("SUPERADMIN")

    const authHeader = req.headers.authorization

    var token: string
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7, authHeader.length).trim()
    } else {
      return invalidAccessTokenMiddleware(res)
    }

    try {
      const jwtDetails = getJwtContentService(token)
      if (rolesAllowed.includes(jwtDetails.role)) {
        // In case of valid details, set role and userId on response object to respective values extracted by token
        res.locals.userId = jwtDetails.userId
        res.locals.role = jwtDetails.role
        next()
      } else throw new JsonWebTokenError("Invalid user role")
    } catch (error) {
      if (error instanceof TokenExpiredError) return expiredTokenMiddleware(res)
      else if (error instanceof JsonWebTokenError) return invalidAccessTokenMiddleware(res)
      else return internalServerErrorResponseMiddleware(res, { errObj: error, desc: "Error in verifyRole Middleware" })
    }
  }
}
