class InvalidCredentialsErr extends Error {
  constructor() {
    super("Credentials are invalid") // Call the Error constructor
    this.name = "InvalidCredentialsErr"

    // Set the prototype explicitly
    Object.setPrototypeOf(this, InvalidCredentialsErr.prototype)
  }
}

export default InvalidCredentialsErr
