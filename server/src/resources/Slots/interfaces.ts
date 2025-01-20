import { z } from "zod"
import { getSlotsAvailabilityAddonSchema, getSlotsFiltersSchema, getSlotsSortingParamsSchema } from "./zodSchemas"

export type ISlotsFilters = z.infer<typeof getSlotsFiltersSchema>
export type ISlotsSortParams = z.infer<typeof getSlotsSortingParamsSchema>
export type IPagingMarkers = {
  index: number
  limit: number
}
export type IAvailabilityParams = z.infer<typeof getSlotsAvailabilityAddonSchema>
