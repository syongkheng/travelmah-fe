export class DateUtils {
  public static calculateDurationInDays(
    start: Date | string,
    end: Date | string,
    includeEndDate: boolean = true,
  ): number {
    if (!start || !end) return 0

    const startDate = new Date(start)
    const endDate = new Date(end)

    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    const timeDiff = endDate.getTime() - startDate.getTime()
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24))

    return includeEndDate ? dayDiff + 1 : dayDiff
  }

  public static extractReadableDateFromTimestamp(timestamp: number | string | undefined): string {
    if (!timestamp) {
      return 'Unknown'
    }
    const date = new Date(timestamp)

    return date
      .toLocaleDateString('en-CA', {
        timeZone: 'Asia/Singapore',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-')
  }

  public static extractReadableTimeFromTimestampWithFormat(
    timestamp: number | string | undefined,
    format: '12h' | '24h',
  ): string {
    if (timestamp === undefined) return 'Unknown timing'
    const date = new Date(timestamp)
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    if (format === '24h') {
      const paddedHours = hours.toString().padStart(2, '0')
      return `${paddedHours}:${minutes}:${seconds}`
    }

    const formattedHours = hours % 12 || 12
    const period = hours >= 12 ? 'PM' : 'AM'

    return `${formattedHours}:${minutes}:${seconds} ${period}`
  }

  public static formatDate(date: Date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  public static addDays(baseDate: Date, days: number) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + days)
    return date
  }
}
