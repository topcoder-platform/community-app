/**
 * Actions related to growsurf (gig referrals)
 */
/* global fetch */
import { redux, config } from 'topcoder-react-utils';

const PROXY_ENDPOINT = `${config.URL.COMMUNITY_APP}/api`;

/**
 * Fetch init
 */
function getReferralIdInit() {
  return {
    loading: true,
  };
}

/**
 * Get referral id for the logged user
 * if this member does not exist in growsurf it creates it in the system
 */
async function getReferralIdDone(profile) {
  if (profile.email) {
    const res = await fetch(`${PROXY_ENDPOINT}/growsurf/participants?participantId=${profile.email}`, {
      method: 'POST',
      body: JSON.stringify({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        tcHandle: profile.handle,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status >= 300) {
      return {
        error: true,
        details: await res.json(),
      };
    }
    const data = await res.json();
    return {
      data,
    };
  }
  // no referral id without email
  return {
    error: true,
    details: 'No profile email found',
  };
}

export default redux.createActions({
  GROWSURF: {
    GET_REFERRALID_INIT: getReferralIdInit,
    GET_REFERRALID_DONE: getReferralIdDone,
  },
});
