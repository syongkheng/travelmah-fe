export class GeneratorUtils {
  static generateSessionID(): string {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0 // Random number between 0 and 15
      const v = c === 'x' ? r : (r & 0x3) | 0x8 // The '4' is fixed for version 4 UUID
      return v.toString(16)
    })

    const timestamp = Date.now()
    return `${uuid}--${timestamp}`
  }

  static generateUUID(): string {
    return crypto.randomUUID()
  }
}
