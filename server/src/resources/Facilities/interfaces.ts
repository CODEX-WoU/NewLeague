import { z } from "zod"
import { addFacilityBodySchema, getFacilitiesQuerySchema } from "./zodSchemas"

export type IAddFacilityBody = z.infer<typeof addFacilityBodySchema>
export type ISelectFilters = z.infer<typeof getFacilitiesQuerySchema>
