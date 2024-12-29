import { z } from "zod"
import { addFacilityBodySchema } from "./zodSchemas"

export type IAddFacilityBody = z.infer<typeof addFacilityBodySchema>
