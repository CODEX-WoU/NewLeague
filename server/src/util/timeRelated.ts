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
