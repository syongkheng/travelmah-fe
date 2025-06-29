import type { AgendaItem } from './AgendaItem'

interface Itinerary {
  id: string | undefined
  sessionTitle: string
  sessionId: string
  shortCode?: string
  destinationRaw: string[]
  destination?: string
  numberOfPax?: number
  itineraryDateRaw?: string[]
  startDate?: number
  endDate?: number
  unknownDate: boolean
  durationInDays: number
  agendaItems: AgendaItem[]
  _agendaIdsToDelete?: string[]
  _agendaIdsToUpdate?: string[]
}

export type { Itinerary }
