import { Updateable } from "kysely"
import { Programmes } from "kysely-codegen"

export interface IProgrammeUpdateSetBody extends Omit<Updateable<Programmes>, "id"> {}
export type IProgrammeUpdateWhereBody = Omit<Updateable<Programmes>, "id"> | { id: string }
