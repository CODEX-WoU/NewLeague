import { Insertable, Updateable } from "kysely"
import { FacilityCategories } from "kysely-codegen"
import db from "../../../services/db"
import logger from "../../../common/logger"
import EmptyObjectError from "../../../common/custom_errors/emptyObjectErr"

export const addFacilityCategoryService = async (insertBody: Insertable<FacilityCategories>) => {
  const result = await db.insertInto("facility_categories").values(insertBody).returningAll().executeTakeFirstOrThrow()

  logger.info("Added facility category: " + result.category_name)

  return result
}

export const getFacilityCategoriesService = async () => {
  const result = await db.selectFrom("facility_categories").selectAll().execute()

  logger.debug("Ran select on facility_categories")

  return result
}

export const updateFacilityCategoryByIdService = async (id: string, updateBody: Updateable<FacilityCategories>) => {
  if (Object.keys(updateBody).length === 0) throw new EmptyObjectError()

  const query = db.updateTable("facility_categories").set(updateBody).where("id", "=", id).returningAll()

  const result = await query.executeTakeFirstOrThrow()

  logger.info("Updated facility category: " + id)

  return result
}

export const deleteFacilityCategoryByIdService = async (id: string) => {
  const result = await db.deleteFrom("facility_categories").where("id", "=", id).executeTakeFirst()

  if (result.numDeletedRows > BigInt(0)) logger.info("Deleted facility_category with id = " + id)

  return !(result.numDeletedRows == BigInt(0))
}
