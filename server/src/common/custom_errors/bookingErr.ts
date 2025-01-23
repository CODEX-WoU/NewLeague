export class InvalidBookingStatusErr extends Error {
  constructor() {
    super("Provided booking status for adding/updating booking is invalid") // Call the Error constructor
    this.name = "InvalidBookingStatusErr"

    // Set the prototype explicitly
    Object.setPrototypeOf(this, InvalidBookingStatusErr.prototype)
  }
}
export class SlotUnavailableErr extends Error {
  constructor(date: string, slotId: string) {
    super(`Slot is unavailable for date=${date} and slotId=${slotId}`) // Call the Error constructor
    this.name = "SlotUnavailableErr"

    // Set the prototype explicitly
    Object.setPrototypeOf(this, SlotUnavailableErr.prototype)
  }
}
