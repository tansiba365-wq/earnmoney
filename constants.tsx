
import { PlanType } from './types';

export const AD_REWARD = 10;
export const MIN_WITHDRAWAL = 1500;
export const SIGNUP_BONUS = 50;
export const REFERRAL_BONUS = 50;
export const REFERRAL_COMMISSION = 0.05; // 5%

export const PLANS = {
  [PlanType.FREE]: { name: 'Free', dailyLimit: 5, price: 0 },
  [PlanType.BASIC]: { name: 'Basic', dailyLimit: 30, price: 500 },
  [PlanType.PRO]: { name: 'Pro', dailyLimit: 50, price: 1000 },
  [PlanType.ELITE]: { name: 'Elite', dailyLimit: 100, price: 2000 },
};

export const MULTIPLIERS = [
  { start: 18, end: 20, value: 2, label: 'Golden Hour (2x)' },
  { start: 0, end: 1, value: 3, label: 'Night Owl (3x)' }
];

export const INITIAL_TASKS = [
  { id: 't1', title: 'Daily Check-in', description: 'Log in every day to earn.', reward: 5, type: 'DAILY_CHECKIN', completedByUserIds: [] },
  { id: 't2', title: 'Ad Enthusiast', description: 'Watch 50 ads total.', reward: 100, type: 'ADS_MILESTONE', completedByUserIds: [] },
  { id: 't3', title: 'Team Builder', description: 'Refer 5 friends.', reward: 250, type: 'REFERRAL_MILESTONE', completedByUserIds: [] }
];
