import db from "../../services/db"
import { Facilities } from "kysely-codegen"
import logger from "../../common/logger"
import { Insertable } from "kysely"
import { ISelectFilters } from "./interfaces"

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
