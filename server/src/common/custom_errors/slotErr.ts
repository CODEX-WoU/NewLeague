export class ConflictingSlotErr extends Error {
  constructor() {
    super("Slot being added/updated to, is conflicting with another slot already registered") // Call the Error constructor
    this.name = "ConflictingSlotErr"

    // Set the prototype explicitly
    Object.setPrototypeOf(this, ConflictingSlotErr.prototype)
  }
}
