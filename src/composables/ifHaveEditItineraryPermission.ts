import { ApiRoute } from '@/constants/route'
import HttpClient from '@/interceptors/HttpClient'

export const ifHaveEditItineraryPermission = async (sessionId: string): Promise<boolean> => {
  const result = await HttpClient.post(ApiRoute.ITINERARY.CHECK_PERMISSION, {
    sessionId,
  })
    .then((res) => {
      return res.data.hasPermission
    })
    .catch((err) => {
      console.error('Error has occured: ', err)
      return false
    })
  return result
}
