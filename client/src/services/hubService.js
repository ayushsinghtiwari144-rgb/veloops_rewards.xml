import { apiFetch } from './api';

// Rewards Store APIs
export const getRewardsApi = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/rewards${query ? `?${query}` : ''}`;
  const data = await apiFetch(endpoint);
  return data.data || [];
};

export const getRewardByIdApi = async (id) => {
  const data = await apiFetch(`/rewards/${id}`);
  return data.data;
};

export const redeemRewardApi = async (id, payload = {}) => {
  const data = await apiFetch(`/rewards/${id}/redeem`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return data.data;
};

// Challenges APIs
export const getChallengesApi = async () => {
  const data = await apiFetch('/challenges');
  return data.data || [];
};

export const claimChallengeApi = async (id) => {
  const data = await apiFetch(`/challenges/${id}/claim`, {
    method: 'POST'
  });
  return data.data;
};

// Leaderboard API
export const getLeaderboardApi = async (period = 'weekly') => {
  const data = await apiFetch(`/leaderboard?period=${period}`);
  return data.data || { leaderboard: [] };
};

// Achievements API
export const getAchievementsApi = async () => {
  const data = await apiFetch('/achievements');
  return data.data || [];
};

// Transactions & History APIs
export const getTransactionsApi = async () => {
  const data = await apiFetch('/transactions');
  return data.data || [];
};

export const getRedemptionsApi = async () => {
  const data = await apiFetch('/transactions/redemptions');
  return data.data || [];
};

// Notifications APIs
export const getNotificationsApi = async () => {
  const data = await apiFetch('/notifications');
  return data.data || { unreadCount: 0, notifications: [] };
};

export const markNotificationReadApi = async (id) => {
  const data = await apiFetch(`/notifications/${id}/read`, {
    method: 'PUT'
  });
  return data.data;
};

export const markAllNotificationsReadApi = async () => {
  const data = await apiFetch('/notifications/read-all', {
    method: 'PUT'
  });
  return data.data;
};

// Profile Update API
export const updateProfileApi = async (payload) => {
  const data = await apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return data.data;
};

// Admin Dashboard APIs
export const getAdminStatsApi = async () => {
  const data = await apiFetch('/admin/stats');
  return data.data;
};

export const createRewardApi = async (rewardData) => {
  const data = await apiFetch('/admin/rewards', {
    method: 'POST',
    body: JSON.stringify(rewardData)
  });
  return data.data;
};

export const updateRewardApi = async (id, rewardData) => {
  const data = await apiFetch(`/admin/rewards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rewardData)
  });
  return data.data;
};

export const deleteRewardApi = async (id) => {
  const data = await apiFetch(`/admin/rewards/${id}`, {
    method: 'DELETE'
  });
  return data.data;
};

export const getAllRedemptionsApi = async () => {
  const data = await apiFetch('/admin/redemptions');
  return data.data || [];
};

export const updateRedemptionStatusApi = async (id, statusData) => {
  const data = await apiFetch(`/admin/redemptions/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData)
  });
  return data.data;
};

export const getAllUsersApi = async () => {
  const data = await apiFetch('/admin/users');
  return data.data || [];
};

export const adjustUserPointsApi = async (id, pointsData) => {
  const data = await apiFetch(`/admin/users/${id}/points`, {
    method: 'POST',
    body: JSON.stringify(pointsData)
  });
  return data.data;
};
