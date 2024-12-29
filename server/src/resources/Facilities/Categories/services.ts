import { Insertable } from "kysely"
import { FacilityCategories } from "kysely-codegen"
import db from "../../../services/db"
import logger from "../../../common/logger"

export const addFacilityCategoryService = async (insertBody: Insertable<FacilityCategories>) => {
  const result = await db.insertInto("facility_categories").values(insertBody).returningAll().executeTakeFirstOrThrow()

  logger.info("Added facility category: " + result.category_name)

  return result
}
