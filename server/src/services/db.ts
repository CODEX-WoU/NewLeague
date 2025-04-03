import { DB } from "kysely-codegen"
import { Client, Pool, types } from "pg"
import { Kysely, PostgresDialect } from "kysely"

import "../common/env"
import appConfig from "../config/appConfig"

types.setTypeParser(types.builtins.INT8, (val) => Number(val))
types.setTypeParser(types.builtins.DATE, (val) => val.toString())

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: appConfig.dbConnectionString,
    }),
  }),
  plugins: [],
})

export default db
