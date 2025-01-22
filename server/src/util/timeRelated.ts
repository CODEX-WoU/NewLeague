export function checkTimeInCorrectFormat(timeString: string) {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/
  return timeRegex.test(timeString)
}
export function isTimeStringLessThan(startTime: string, endTime: string): boolean {
  // Convert the time strings to Date objects for comparison
  const date1 = new Date(`1970-01-01T${startTime}Z`)
  const date2 = new Date(`1970-01-01T${endTime}Z`)

  // Compare the Date objects
  return date1 < date2
}

export function generateDateIgnoringTz(dateString?: string) {
  var now = new Date()
  if (dateString) now = new Date(dateString)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0") // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")

  // Construct ISO 8601 formatted string without time zone
  const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`

  // Create Date object as if it's UTC
  const dateInUTC = new Date(isoDateString)

  return dateInUTC
}
