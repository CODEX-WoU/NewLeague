import { DB } from "kysely-codegen"
import { Pool } from "pg"
import { Kysely, PostgresDialect } from "kysely"

import "../common/env"
import appConfig from "../config/appConfig"

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: appConfig.dbConnectionString,
    }),
  }),
  plugins: [],
})

export default db
