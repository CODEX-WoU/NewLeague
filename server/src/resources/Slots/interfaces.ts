import { z } from "zod"
import { getSlotsFiltersSchema, getSlotsSortingParamsSchema } from "./zodSchemas"

export type ISlotsFilters = z.infer<typeof getSlotsFiltersSchema>
export type ISlotsSortParams = z.infer<typeof getSlotsSortingParamsSchema>
export type IPagingMarkers = {
  index: number
  limit: number
}
