import { apiFetch, getStoredToken } from './api';

export { getStoredToken };

/**
 * Fetch active giveaways from API
 */
export const fetchCurrentGiveawaysApi = async () => {
  try {
    const data = await apiFetch('/giveaways/current');
    const result = data?.data;
    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (typeof result === 'object') return [result];
    return [];
  } catch (err) {
    if (err.code === 'GIVEAWAY_NOT_FOUND' || err.status === 404) {
      return [];
    }
    throw err;
  }
};

/**
 * Fetch single giveaway details from API
 */
export const fetchGiveawayByIdApi = async (idOrSlug) => {
  const data = await apiFetch(`/giveaways/${idOrSlug}`);
  return data.data;
};

/**
 * Fetch user's participation status for a giveaway
 */
export const fetchMyParticipationStatusApi = async (idOrSlug) => {
  const token = getStoredToken();
  if (!token) return { participated: false };

  try {
    const data = await apiFetch(`/giveaways/${idOrSlug}/my-status`);
    return data.data || { participated: false };
  } catch (err) {
    return { participated: false };
  }
};

/**
 * Submit real giveaway join request to backend
 */
export const joinGiveawayApi = async (idOrSlug, requestId = null) => {
  const reqId = requestId || `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const data = await apiFetch(`/giveaways/${idOrSlug}/join`, {
    method: 'POST',
    body: JSON.stringify({ requestId: reqId })
  });

  return data.data;
};

/**
 * Fetch public winners for a specific giveaway
 */
export const getWinnersApi = async (idOrSlug) => {
  const data = await apiFetch(`/giveaways/${idOrSlug}/winners`);
  return data.data || [];
};

/**
 * Fetch previous historical winners
 */
export const getPreviousWinnersApi = async () => {
  const data = await apiFetch('/giveaways/previous/winners');
  return data.data || [];
};

/**
 * Fetch user's own claim status
 */
export const getMyClaimApi = async (idOrSlug) => {
  const token = getStoredToken();
  if (!token) return { claimed: false };

  try {
    const data = await apiFetch(`/giveaways/${idOrSlug}/my-claim`);
    return data.data || { claimed: false };
  } catch (err) {
    return { claimed: false };
  }
};

/**
 * Submit prize claim to API
 */
export const submitClaimApi = async (idOrSlug, claimData) => {
  const data = await apiFetch(`/giveaways/${idOrSlug}/claim`, {
    method: 'POST',
    body: JSON.stringify(claimData)
  });

  return data.data;
};
