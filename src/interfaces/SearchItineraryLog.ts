export interface SearchItineraryLog {
  id: number
  itineraryId: string
  username: string
}

export interface SearchItineraryLogJoinItinerary extends SearchItineraryLog {
  createdDt: number
  sessionTitle: string
  unknownDate: boolean
  startDate?: number
  endDate?: number
  destinationRaw?: string
  destination?: string
  numberOfPax: number
}
