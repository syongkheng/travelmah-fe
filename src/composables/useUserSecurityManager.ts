import { ApiRoute } from '@/constants/route'
import HttpClient from '@/interceptors/HttpClient'

export function useUserSecurityManager() {
  const validPw = async (pw: string): Promise<boolean> => {
    const result = await HttpClient.post(ApiRoute.ACCOUNT.VALIDATE_PW, {
      data: pw,
    })
      .then((res) => {
        return res.data.data
      })
      .catch((err) => {
        console.log('err', err)
        return false
      })
    return result
  }

  const changePw = (oldPw: string, newPw: string, cfmPw: string): Promise<boolean> => {
    const result = HttpClient.post(ApiRoute.ACCOUNT.CHANGE_PW, {
      data: {
        old: oldPw,
        new: newPw,
        cfm: cfmPw,
      },
    })
      .then((res) => {
        return res.data.data
      })
      .catch((err) => {
        console.log('err', err)
      })

    return result
  }

  return {
    validPw,
    changePw,
  }
}
