import { Insertable, Updateable } from "kysely"
import { Programmes } from "kysely-codegen"
import db from "../../../services/db"
import logger from "../../../common/logger"

export async function addProgrammesService(programmes: Insertable<Programmes>[]) {
  const idsOfInsertedProgrammes = await db.transaction().execute(async (trx) => {
    const insertionResults = await trx.insertInto("programmes").values(programmes).returning("id").execute()

    return insertionResults
  })

  logger.info("Inserted " + idsOfInsertedProgrammes + " new programmes to DB")

  return idsOfInsertedProgrammes
}

export async function updateProgrammeByIdService(id: string, updatedProgramme: Updateable<Programmes>) {
  const updateResult = await db
    .updateTable("programmes")
    .set(updatedProgramme)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow()

  logger.info("Updated programme with id = " + id)

  return updateResult
}

export async function updateProgrammesService(ids: string[], newDetails: Updateable<Programmes>) {
  const updationResults = await db
    .updateTable("programmes")
    .where("id", "in", ids)
    .set(newDetails)
    .returningAll()
    .execute()

  logger.info("Updated programmes with ID = " + ids)

  return updationResults
}
