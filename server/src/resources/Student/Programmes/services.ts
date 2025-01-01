import { Insertable, Updateable } from "kysely"
import { Programmes } from "kysely-codegen"
import db from "../../../services/db"
import logger from "../../../common/logger"
import { IProgrammeUpdateSetBody, IProgrammeUpdateWhereBody } from "./interfaces"

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

export async function updateProgrammesService(set: IProgrammeUpdateSetBody, where: IProgrammeUpdateWhereBody) {
  if ("id" in where) {
    return [await updateProgrammeByIdService(where.id, set)]
  } else {
    var updateQuery = db.updateTable("programmes")

    if (where.course) updateQuery = updateQuery.where("course", "=", where.course)
    if (where.specialization) updateQuery = updateQuery.where("specialization", "=", where.specialization)
    if (where.year) updateQuery = updateQuery.where("year", "=", where.year)

    updateQuery = updateQuery.set(set)
    const executionResults = await updateQuery.returningAll().execute()

    return executionResults
  }
}
