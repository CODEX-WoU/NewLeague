export class ConflictingSlotErr extends Error {
  constructor() {
    super("Slot being added/updated to, is conflicting with another slot already registered") // Call the Error constructor
    this.name = "ConflictingSlotErr"

    // Set the prototype explicitly
    Object.setPrototypeOf(this, ConflictingSlotErr.prototype)
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
