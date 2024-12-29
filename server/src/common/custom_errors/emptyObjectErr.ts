class EmptyObjectError extends Error {
  constructor() {
    super("Empty objects are not allowed for this operation") // Call the Error constructor
    this.name = "EmptyObjectError"

    // Set the prototype explicitly
    Object.setPrototypeOf(this, EmptyObjectError.prototype)
  }
}

export default EmptyObjectError
