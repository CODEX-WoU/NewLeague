export class OtpTimestampInvalidErr extends Error {
  constructor() {
    super("Timestamp of OTP should be a valid timestamp in the future") // Call the Error constructor
    this.name = "OtpTimestampInvalidErr"

    // Set the prototype explicitly
    Object.setPrototypeOf(this, OtpTimestampInvalidErr.prototype)
  }
}
