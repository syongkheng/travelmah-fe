import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { FlightForm } from '@/interfaces/Flight'

export const useFlightStore = defineStore('flight', () => {
  const flightDetails = reactive<FlightForm>({
    departureAirport: {
      code: '',
      name: '',
      terminal: '',
    },
    arrivalAirport: {
      code: '',
      name: '',
      terminal: '',
    },
    startDt: 0,
    endDt: 0,
    flightCode: '',
    airline: '',
    passenger: [
      {
        name: '',
      },
    ],
  })

  return { flightDetails }
})
