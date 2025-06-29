import { GeneratorUtils } from '@/utilities/GeneratorUtils'
import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

export function useNav() {
  const router = useRouter()

  const redirectTo = (
    route: RouteLocationRaw | URL | string,
    options: {
      replace?: boolean
      newTab?: boolean
      query?: Record<string, string>
      hash?: string
    } = {},
  ) => {
    const { replace = false, newTab = false, query, hash } = options

    console.log('q, h', { query, hash })

    let queryString = ''
    if (query) {
      const params = new URLSearchParams(query)
      queryString = `?${params.toString()}`
    }

    if (hash) {
      queryString += (queryString ? '&' : '?') + `#${hash}`
    }

    // Handle external URLs
    if (typeof route === 'string' && (route.startsWith('http') || route.startsWith('//'))) {
      return handleExternalUrl(route, newTab)
    }

    // Handle internal URLs in new tab
    if (newTab) {
      const resolved = router.resolve(route)
      const fullPath = resolved.href + queryString // Append query string
      return window.open(fullPath, '_blank')
    }

    // Handle internal URLs without opening in a new tab
    let finalRoute = ''
    if (typeof route === 'string') {
      finalRoute = route
    } else if ('path' in route) {
      finalRoute = route.path ?? ''
    }

    const routeWithQuery = finalRoute + queryString

    const navigate = replace ? router.replace : router.push
    return navigate(routeWithQuery)
  }

  const handleExternalUrl = (url: string, newTab: boolean) => {
    if (newTab) {
      window.open(url, '_blank')
    } else {
      window.location.href = url
    }
  }

  // Predefined routes
  const redirectRegister = (options = {}) => redirectTo('/register', options)

  const redirectToLogin = () => redirectTo('/login')

  const redirectToPlanning = () => {
    redirectTo('/plan', {
      newTab: false,
      query: {
        session: GeneratorUtils.generateSessionID(),
      },
    })
  }

  const redirectToViewSessionId = (
    sessionId: string | undefined,
    isOpenNewTab: boolean = false,
  ) => {
    redirectTo(`/itinerary/${sessionId}`, {
      newTab: isOpenNewTab,
    })
  }

  const redirectToEditSessionId = (sessionId: string | undefined) => {
    redirectTo(`/itinerary/edit/${sessionId}`)
  }

  const redirectToSearch = (options: { newTab?: boolean } = { newTab: false }) => {
    redirectTo('/search', {
      newTab: options.newTab,
    })
  }

  const redirectToDashboard = () => {
    redirectTo('/dashboard')
  }

  const refreshPage = () => {
    window.location.reload()
  }

  const redirectToLanding = () => {
    redirectTo('/')
  }

  const redirectToUnauthorized = () => {
    redirectTo('/unauthorized')
  }

  return {
    refreshPage,
    redirectTo,
    redirectRegister,
    redirectToLogin,
    redirectToPlanning,
    redirectToSearch,
    redirectToViewSessionId,
    redirectToEditSessionId,
    redirectToLanding,
    redirectToDashboard,
    redirectToUnauthorized,
  }
}
