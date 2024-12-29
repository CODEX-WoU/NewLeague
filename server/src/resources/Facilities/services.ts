import db from "../../services/db"
import { Facilities } from "kysely-codegen"
import logger from "../../common/logger"
import { Insertable } from "kysely"

export const addFacilityService = async (body: Insertable<Facilities>) => {
  const result = await db.insertInto("facilities").values(body).returningAll().executeTakeFirstOrThrow()

  logger.info("Added facility to DB with name: " + result.name)

  return result
}
