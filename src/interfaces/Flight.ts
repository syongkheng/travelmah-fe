import type { Passenger } from './Passenger'

interface FlightForm {
  departureAirport: Airport
  arrivalAirport: Airport
  startDt: number
  endDt: number
  flightCode: string
  airline: string
  passenger: Passenger[]
}

export type { FlightForm }

interface Airport {
  name: string
  code: string
  terminal: string
}

export type { Airport }
