import { Insertable, Updateable } from "kysely"
import { UserRole, Users } from "kysely-codegen"
import db from "../../../services/db"
import logger from "../../../common/logger"

export const getAdminByIdService = async (ids: string[] | string) => {
  var selectStmt = db
    .selectFrom("users")
    .select(["email", "id", "name", "phone_no", "role"])
    .where("role", "=", "ADMIN")

  if (Array.isArray(ids)) selectStmt = selectStmt.where("id", "in", ids)
  else selectStmt = selectStmt.where("id", "=", ids)
  const admins = selectStmt.execute()

  logger.debug("Ran SELECT on users for ADMIN role")
  return admins
}

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

export const updateAdminByIdService = async (newAdminDetails: Omit<Updateable<Users>, "id" | "role">, id: string) => {
  const updatedAdmin = await db
    .updateTable("users")
    .set(newAdminDetails)
    .where("id", "=", id)
    .where("role", "=", "ADMIN")
    .returning(["email", "id", "name", "phone_no", "role"])
    .executeTakeFirstOrThrow()

  logger.info(`Updated ADMIN with id ${id}`)

  return updatedAdmin
}
