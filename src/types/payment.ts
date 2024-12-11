import { Claim } from './index';

export type PaymentStatus = 'open' | 'validated' | 'rejected';

export interface Payment {
  id: string;
  reference: string;
  payerCompanyId: string;
  receiverCompanyId: string;
  amount: number;
  status: PaymentStatus;
  claims: string[]; // Array of claim IDs
  proofDocument?: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
  };
  comments: {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  validatedAt?: Date;
  createdBy: string;
}

export interface PaymentSummary {
  totalAmount: number;
  selectedClaims: Claim[];
}