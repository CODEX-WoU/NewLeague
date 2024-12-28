import { DB } from "kysely-codegen"
import { Pool } from "pg"
import { Kysely, PostgresDialect } from "kysely"

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})

export default db
