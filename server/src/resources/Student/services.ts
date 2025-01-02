import { Insertable } from "kysely"
import logger from "../../common/logger"
import db from "../../services/db"
import { IFetchStudentsFilters } from "./interfaces"
import { Students, Users } from "kysely-codegen"

export const fetchStudentsService = async (
  filters: IFetchStudentsFilters,
  pagingMarkers?: { startIndex: number; limit: number },
) => {
  var selectStmt = db
    .selectFrom("users")
    .where("role", "=", "STUDENT")
    .innerJoin("students", "users.id", "students.student_id")
    .innerJoin("programmes", "students.programme_id", "programmes.id")
    .select([
      "users.id as id",
      "users.name as name",
      "users.email as email",
      "users.phone_no as phone_no",
      "students.id as _st_id",
      "programmes.course as course",
      "programmes.specialization as specialization",
      "programmes.year as est_grad_year",
    ])

  // Adding filters
  if (typeof filters.course === "string") selectStmt = selectStmt.where("course", "=", filters.course)
  else if (Array.isArray(filters.course)) selectStmt = selectStmt.where("course", "in", filters.course)

  if (typeof filters.specialization === "string")
    selectStmt = selectStmt.where("specialization", "=", filters.specialization)
  else if (Array.isArray(filters.specialization))
    selectStmt = selectStmt.where("specialization", "in", filters.specialization)

  if (typeof filters.year === "number") selectStmt = selectStmt.where("year", "=", filters.year)
  else if (Array.isArray(filters.year)) selectStmt = selectStmt.where("year", "in", filters.year)

  // Applying paging markers
  if (pagingMarkers) {
    selectStmt = selectStmt.limit(pagingMarkers.limit).offset(pagingMarkers.startIndex)
  }

  const students = await selectStmt.execute()

  logger.debug("Ran SELECT on students + users + programmes join")
  return students
}

export const addStudentService = async (
  userInfo: Insertable<Users>,
  studentInfo: Omit<Insertable<Students>, "student_id">,
) => {
  const newStudentId = await db.transaction().execute(async (trx) => {
    const addedUser = await trx.insertInto("users").values(userInfo).returningAll().executeTakeFirst()

    if (!addedUser)
      throw new Error("Could not add user to DB when trying to insert student to DB. Rolling back transaction")

    const addedStudent = await trx
      .insertInto("students")
      .values({ ...studentInfo, student_id: addedUser.id })
      .returningAll()
      .executeTakeFirst()
    if (!addedStudent)
      throw new Error("Could not add student to DB when trying to insert student. Rolling back transaction")

    logger.info(`Inserted new STUDENT with users.id = ${addedUser.id} and students.id = ${addedStudent.id}`)

    return addedUser.id
  })

  return newStudentId
}
