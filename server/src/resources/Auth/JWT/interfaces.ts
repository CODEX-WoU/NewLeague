import { JwtPayload } from "jsonwebtoken"
import { UserRole } from "kysely-codegen"

export interface IJWTCreationCustomParameters {
  role: UserRole | "SUPERADMIN"
  userId?: string
}

export interface IJWTPayload extends JwtPayload, IJWTCreationCustomParameters {}
