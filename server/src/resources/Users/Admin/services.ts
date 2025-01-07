import { Insertable } from "kysely"
import { UserRole, Users } from "kysely-codegen"
import db from "../../../services/db"
import logger from "../../../common/logger"

export const addAdminService = async (adminUserInfo: Omit<Insertable<Users>, "role">) => {
  const addable = { ...adminUserInfo, role: "ADMIN" as UserRole }

  const addedAdmin = await db.insertInto("users").values(addable).returningAll().executeTakeFirstOrThrow()

  logger.warn(`New ADMIN added to DB with email: ` + addedAdmin.email)

  return addedAdmin
}

export const deleteAdminService = async (adminId: string) => {
  const deletedAdmin = await db
    .deleteFrom("users")
    .where("id", "=", adminId)
    .where("role", "=", "ADMIN")
    .returning(["id", "email"])
    .executeTakeFirstOrThrow()

  logger.warn(`ADMIN with ID = ${deletedAdmin.id} and email = ${deletedAdmin.email} DELETED from DB`)

  return deletedAdmin.id
}
