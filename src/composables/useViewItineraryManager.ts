// useViewItineraryManager.ts
import { ApiRoute } from '@/constants/route'
import HttpClient from '@/interceptors/HttpClient'

export const useViewItineraryManager = () => {
  const retrieveItinerary = async (sessionId: string | undefined) => {
    return await HttpClient.get(`${ApiRoute.ITINERARY.RETRIEVE_BY_ID(sessionId)}`)
      .then((res) => {
        console.log('Ok: ', res.data)
        return res.data
      })
      .catch((err) => {
        console.error('Error: ', err)
        return null
      })
  }

  return {
    retrieveItinerary,
  }
}
