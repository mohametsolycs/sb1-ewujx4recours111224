export const DB_NAME = 'claims-db';
export const DB_VERSION = 5; // Increment version to force schema update

export const STORES = {
  CLAIMS: 'claims',
  COMMENTS: 'comments',
  DOCUMENTS: 'documents',
  NOTIFICATIONS: 'notifications',
  PAYMENTS: 'payments',
  PAYMENT_CLAIMS: 'payment_claims',
  PAYMENT_COMMENTS: 'payment_comments',
} as const;

export const INDEXES = {
  CLAIMS: {
    BY_STATUS: 'by-status',
    BY_DATE: 'by-date',
    BY_INSURER: 'by-insurer',
  },
  COMMENTS: {
    BY_CLAIM: 'by-claim',
    BY_DATE: 'by-date',
  },
  DOCUMENTS: {
    BY_CLAIM: 'by-claim',
    BY_CATEGORY: 'by-category',
  },
  NOTIFICATIONS: {
    BY_CLAIM: 'by-claim',
    BY_USER: 'by-user',
    BY_READ: 'by-read',
    BY_DATE: 'by-date',
  },
  PAYMENTS: {
    BY_PAYER: 'by-payer',
    BY_RECEIVER: 'by-receiver',
    BY_STATUS: 'by-status',
    BY_DATE: 'by-date',
  },
  PAYMENT_CLAIMS: {
    BY_PAYMENT: 'by-payment',
    BY_CLAIM: 'by-claim',
  },
  PAYMENT_COMMENTS: {
    BY_PAYMENT: 'by-payment',
    BY_DATE: 'by-date',
  },
} as const;