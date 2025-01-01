import { Insertable, Updateable } from "kysely"
import { Programmes } from "kysely-codegen"
import db from "../../../services/db"
import logger from "../../../common/logger"
import EmptyObjectError from "../../../common/custom_errors/emptyObjectErr"

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

export async function updateProgrammesByIdsService(ids: string[], newDetails: Updateable<Programmes>) {
  if (Object.keys(newDetails).length === 0) throw new EmptyObjectError()

  const updationResults = await db
    .updateTable("programmes")
    .where("id", "in", ids)
    .set(newDetails)
    .returningAll()
    .execute()

  logger.info("Updated programmes with ID = " + ids)

  return updationResults
}

export async function getProgrammeService(id: string) {
  const programmes = await db.selectFrom("programmes").selectAll().where("id", "=", id).executeTakeFirstOrThrow()

  logger.debug("Ran SELECT on programmes")
  return programmes
}

export async function getProgrammesService(ids?: string[]) {
  var selectStmt = db.selectFrom("programmes").selectAll()
  if (Array.isArray(ids)) selectStmt = selectStmt.where("id", "in", ids)

  const programmes = await selectStmt.execute()
  logger.debug("Ran SELECT on programmes")

  return programmes
}
