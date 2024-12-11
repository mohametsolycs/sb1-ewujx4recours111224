import { DBSchema } from 'idb';
import { Claim, Comment, Document, Notification } from '../../types';
import { Payment } from '../../types/payment';

export interface ClaimsDB extends DBSchema {
  claims: {
    key: string;
    value: Claim;
    indexes: {
      'by-status': string;
      'by-date': Date;
      'by-insurer': string;
    };
  };
  comments: {
    key: string;
    value: Comment & { claimId: string };
    indexes: {
      'by-claim': string;
      'by-date': Date;
    };
  };
  documents: {
    key: string;
    value: Document & { claimId: string };
    indexes: {
      'by-claim': string;
      'by-category': string;
    };
  };
  notifications: {
    key: string;
    value: Notification & { claimId?: string };
    indexes: {
      'by-claim': string;
      'by-user': string;
      'by-read': boolean;
      'by-date': Date;
    };
  };
  payments: {
    key: string;
    value: Payment;
    indexes: {
      'by-payer': string;
      'by-receiver': string;
      'by-status': string;
      'by-date': Date;
    };
  };
  payment_claims: {
    key: [string, string]; // [paymentId, claimId]
    value: {
      paymentId: string;
      claimId: string;
    };
    indexes: {
      'by-payment': string;
      'by-claim': string;
    };
  };
  payment_comments: {
    key: string;
    value: Comment & { paymentId: string };
    indexes: {
      'by-payment': string;
      'by-date': Date;
    };
  };
}