import { DB } from "kysely-codegen"
import { Pool } from "pg"
import { Kysely, PostgresDialect } from "kysely"

import "../common/env"

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  plugins: [],
})

export default db
