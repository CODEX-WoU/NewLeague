import { z } from "zod"
import { fetchStudentsRequestBodySchema } from "./zodSchemas"

export type IFetchStudentsFilters = z.infer<typeof fetchStudentsRequestBodySchema>
