export class InvalidBookingStatusErr extends Error {
  constructor() {
    super("Provided booking status for adding/updating booking is invalid") // Call the Error constructor
    this.name = "InvalidBookingStatusErr"

    // Set the prototype explicitly
    Object.setPrototypeOf(this, InvalidBookingStatusErr.prototype)
  }
}
