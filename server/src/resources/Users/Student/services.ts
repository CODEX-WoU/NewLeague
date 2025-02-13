import { Insertable, Updateable } from "kysely"
import logger from "../../../common/logger"
import db from "../../../services/db"
import { IFetchStudentsFilters } from "./interfaces"
import { Students, Users } from "kysely-codegen"
import EmptyObjectError from "../../../common/custom_errors/emptyObjectErr"

export const fetchStudentsService = async (
  filters: IFetchStudentsFilters,
  pagingMarkers?: { startIndex: number; limit: number },
) => {
  var selectStmt = db
    .selectFrom("users")
    .where("role", "=", "STUDENT")
    .where("users.is_deleted", "=", false)
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

  if ("ids" in filters) {
    selectStmt = selectStmt.where("users.id", "in", filters.ids)
  } else {
    // Adding filters
    if (typeof filters.course === "string") selectStmt = selectStmt.where("programmes.course", "=", filters.course)
    else if (Array.isArray(filters.course)) selectStmt = selectStmt.where("programmes.course", "in", filters.course)

    if (typeof filters.specialization === "string")
      selectStmt = selectStmt.where("specialization", "=", filters.specialization)
    else if (Array.isArray(filters.specialization))
      selectStmt = selectStmt.where("specialization", "in", filters.specialization)

    if (typeof filters.year === "number") selectStmt = selectStmt.where("year", "=", filters.year)
    else if (Array.isArray(filters.year)) selectStmt = selectStmt.where("year", "in", filters.year)
  }

  // Applying paging markers
  if (pagingMarkers) {
    selectStmt = selectStmt.limit(pagingMarkers.limit).offset(pagingMarkers.startIndex)
  }

  const students = await selectStmt.execute()

  logger.debug("Ran SELECT on students + users + programmes join")
  return students
}

export const getStudentByIdService = async (id: string) => {
  console.log(id)
  const student = await db
    .selectFrom("users")
    .where("users.id", "=", id)
    .where("users.role", "=", "STUDENT")
    .where("users.is_deleted", "=", false)
    .leftJoin("students", "users.id", "students.student_id")
    .leftJoin("programmes", "students.programme_id", "programmes.id")
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
    .executeTakeFirstOrThrow()

  logger.debug("SELECTed one user (STUDENT) record with users.id = " + id)

  return student
}

export const addStudentService = async (
  userInfo: Insertable<Users>,
  studentInfo: Omit<Insertable<Students>, "student_id">,
) => {
  const newStudentId = await db.transaction().execute(async (trx) => {
    const addedUser = await trx.insertInto("users").values(userInfo).returningAll().executeTakeFirst()

    if (!addedUser)
      throw new Error("Could not add user to DB when trying to insert student to DB. Rolling back transaction")
    console.log(studentInfo)
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

export const updateStudentByIdService = async (id: string, newDetails: Updateable<Students> & Updateable<Users>) => {
  if (Object.keys(newDetails).length == 0) throw new EmptyObjectError()

  await db.transaction().execute(async (trx) => {
    delete newDetails.id
    delete newDetails.student_id

    await trx
      .updateTable("users")
      .set({
        name: newDetails.name,
        password: newDetails.password,
        phone_no: newDetails.phone_no,
        email: newDetails.email,
      })
      .where("id", "=", id)
      .executeTakeFirstOrThrow()

    if (newDetails.programme_id) {
      await trx
        .updateTable("students")
        .set({ programme_id: newDetails.programme_id })
        .where("student_id", "=", id)
        .returning("programme_id")
        .executeTakeFirstOrThrow()
    }
  })

  logger.debug("Updated STUDENT with id = " + id)

  return await getStudentByIdService(id)
}

export const deleteStudentByIdService = async (id: string) => {
  const deletedStudentId = await db.transaction().execute(async (trx) => {
    await trx.deleteFrom("students").where("student_id", "=", id).execute()
    const deletedStudentId = await trx
      .updateTable("users")
      .where("id", "=", id)
      .where("role", "=", "STUDENT")
      .set({ is_deleted: true })
      .returning("id")
      .executeTakeFirstOrThrow()

    return deletedStudentId
  })

  logger.info(`Soft deleted STUDENT with id=${deletedStudentId}`)
  return deletedStudentId
}
