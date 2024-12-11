import { Claim } from './index';

export interface Settlement {
  id: string;
  startDate: Date;
  endDate: Date;
  insurerA: string;
  insurerB: string;
  claims: string[]; // Claim IDs
  totalAmountA: number;
  totalAmountB: number;
  netBalance: number;
  creditorId: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

export interface SettlementSummary {
  insurerA: {
    id: string;
    name: string;
    totalAmount: number;
    claims: Claim[];
  };
  insurerB: {
    id: string;
    name: string;
    totalAmount: number;
    claims: Claim[];
  };
  netBalance: number;
  creditor: string | null;
}