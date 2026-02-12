
export enum PlanType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ELITE = 'ELITE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  referralCode: string;
  referredBy?: string;
  balance: number;
  referralEarnings: number;
  plan: PlanType;
  planExpiry?: number;
  dailyAdsWatched: number;
  lastAdResetDate: string;
  totalAdsWatched: number;
  spinsAvailable: number;
  fingerprint: string;
  isFlagged: boolean;
  createdAt: number;
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  method: 'JazzCash' | 'EasyPaisa';
  transactionId?: string; // For deposits
  status: TransactionStatus;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'ADS_MILESTONE' | 'DAILY_CHECKIN' | 'PROFILE' | 'REFERRAL_MILESTONE';
  completedByUserIds: string[];
}

export interface AppState {
  users: User[];
  transactions: Transaction[];
  tasks: Task[];
  systemStats: {
    totalPayouts: number;
    totalAdsWatched: number;
  };
}

export type View = 'HOME' | 'ADS' | 'TASKS' | 'SPIN' | 'LEADERBOARD' | 'PROFILE' | 'ADMIN' | 'AUTH';
