import { ApiRoute } from '@/constants/route'
import HttpClient from '@/interceptors/HttpClient'
import type { SearchItineraryLogJoinItinerary } from '@/interfaces/SearchItineraryLog'

export function useDashboardManager() {
  const getLastLoggedInDt = async (): Promise<string> => {
    const result = await HttpClient.get(ApiRoute.PROFILE.INFO)
      .then((res) => {
        console.log('res', res)
        return res.data.data
      })
      .catch((err) => {
        console.log('err', err)
        return 'Unknown'
      })
    return result
  }

  const getRecentSearches = (): Promise<SearchItineraryLogJoinItinerary[]> => {
    const result = HttpClient.get(ApiRoute.PROFILE.RECENT_SEARCHES)
      .then((res) => {
        console.log('res', res)
        return res.data.data
      })
      .catch((err) => {
        console.log('err', err)
      })

    console.log('>', result)
    return result
  }

  return {
    getLastLoggedInDt,
    getRecentSearches,
  }
}
