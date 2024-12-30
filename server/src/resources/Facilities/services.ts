import db from "../../services/db"
import { Facilities } from "kysely-codegen"
import logger from "../../common/logger"
import { Insertable, Updateable } from "kysely"
import { ISelectFilters } from "./interfaces"
import EmptyObjectError from "../../common/custom_errors/emptyObjectErr"

export const getFacilitiesService = async (selectFilters?: ISelectFilters) => {
  var baseQuery = db
    .selectFrom("facilities")
    .leftJoin("facility_categories", "facilities.category_id", "facility_categories.id")
    .select([
      "facilities.id as id",
      "facilities.name as name",
      "facilities.cover_image_url",
      "facilities.description",
      "facilities.extra_image_urls",
      "facilities.number_of_courts",
      "facilities.capacity_per_court",
      "facility_categories.id as category_id",
      "facility_categories.category_name as category_name",
    ])

  if (selectFilters?.categoriesIdFilter) {
    baseQuery = baseQuery.where("category_id", "in", selectFilters.categoriesIdFilter)
  }

  const selectResult = await baseQuery.execute()

  logger.debug("Select query ran on facilities")

  return selectResult
}

export const addFacilityService = async (body: Insertable<Facilities>) => {
  const result = await db.insertInto("facilities").values(body).returningAll().executeTakeFirstOrThrow()

  logger.info("Added facility to DB with name: " + result.name)

  return result
}

export const updateFacilityByIdService = async (id: string, updateBody: Updateable<Facilities>) => {
  if (Object.keys(updateBody).length === 0) throw new EmptyObjectError()

  const updateQuery = db.updateTable("facilities").set(updateBody).where("id", "=", id).returningAll()
  const updateExecuteResult = await updateQuery.executeTakeFirstOrThrow()

  logger.info("Update facility with id = " + id)

  return updateExecuteResult
}

export const deleteFacilityByIdsService = async (id: string | string[]) => {
  var baseQuery = db.deleteFrom("facilities")

  if (typeof id === "string") baseQuery = baseQuery.where("id", "=", id)
  else baseQuery = baseQuery.where("id", "in", id)

  const result = await baseQuery.executeTakeFirst()

  if (result.numDeletedRows > BigInt(0)) logger.info("Deleted facility_category with ids = " + id)
  return Number(result.numDeletedRows)
}
