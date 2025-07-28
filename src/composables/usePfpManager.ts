import { ApiRoute } from '@/constants/route'
import HttpClient from '@/interceptors/HttpClient'
import type { PfpRequest } from '@/interfaces/PfpRequest'
import type { ProfileResponse } from '@/interfaces/ProfileResponse'

export function usePfpManager() {
  const retrievePfp = async (): Promise<string> => {
    const result = await HttpClient.get(ApiRoute.PFP.RETRIEVE)
      .then((res) => {
        return res.data.data.blob
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          return ''
        }
        console.log('err', err)
        return ''
      })
    return result
  }

  const replacePfp = (payload: PfpRequest): Promise<{ blob: string }> => {
    const result = HttpClient.post(ApiRoute.PFP.REPLACE, { ...payload })
      .then((res) => {
        return res.data.message
      })
      .catch((err) => {
        console.log('err', err)
      })

    return result
  }

  const removePfp = (): Promise<ProfileResponse> => {
    const result = HttpClient.post(ApiRoute.PFP.REMOVE)
      .then((res) => {
        return res.data.message
      })
      .catch((err) => {
        console.log('err', err)
      })

    return result
  }

  return {
    retrievePfp,
    replacePfp,
    removePfp,
  }
}
