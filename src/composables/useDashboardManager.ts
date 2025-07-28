import { ApiRoute } from '@/constants/route'
import HttpClient from '@/interceptors/HttpClient'
import type { ProfileResponse } from '@/interfaces/ProfileResponse'
import type { SearchItineraryLogJoinItinerary } from '@/interfaces/SearchItineraryLog'

export function useDashboardManager() {
  const getLastLoggedInDt = async (): Promise<string> => {
    const result = await HttpClient.get(ApiRoute.PROFILE.INFO)
      .then((res) => {
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
        return res.data.data
      })
      .catch((err) => {
        console.log('err', err)
      })

    return result
  }

  const getSelfProfile = (): Promise<ProfileResponse> => {
    const result = HttpClient.get(ApiRoute.PROFILE.SELF)
      .then((res) => {
        return res.data.data
      })
      .catch((err) => {
        console.log('err', err)
      })

    return result
  }

  return {
    getLastLoggedInDt,
    getRecentSearches,
    getSelfProfile,
  }
}
