export interface CalendarItem {
  id: string
  date: number
  title: string
  type: 'flight' | 'hotel' | 'activity' | 'transport' | 'meal' | 'other'
}
