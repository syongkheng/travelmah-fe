export const ApiRoute = {
  PROFILE: {
    INFO: `/api/profile/info`,
    RECENT_SEARCHES: `/api/profile/recent-search`,
    SELF: `/api/profile/`,
  },
  AUTHENTICATE: {
    REGISTER: `/api/auth/register`,
    LOGIN: `/api/auth/login`,
    AUTHENTICATE: `/api/auth/authenticate`,
    TOKEN_VERIFICATION: `/api/auth/verification`,
  },
  ITINERARY: {
    RETRIEVE_BY_ID: (sessionId: string | undefined) => `/api/itinerary/${sessionId}`,
    CREATE: `/api/itinerary`,
    MODIFY: `/api/itinerary/edit`,
    CHECK_PERMISSION: `/api/itinerary/challenge`,
    ADD_COLLABORATOR: `/api/itinerary/add-collaborator`,
  },
  FILE: {
    CREATE: `/api/file`,
    DELETE: `/api/file/delete`,
  },
  PFP: {
    REPLACE: `/api/pfp`,
    REMOVE: `/api/pfp/remove`,
    RETRIEVE: `/api/pfp`,
  },
  ACCOUNT: {
    VALIDATE_PW: `/api/security/pw/validate`,
    CHANGE_PW: `/api/security/pw/change`,
  },
}
