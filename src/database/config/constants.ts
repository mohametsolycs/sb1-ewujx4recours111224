export const DATABASE = {
  NAME: 'claims-management-db',
  VERSION: 5, // Increment version to force schema update
} as const;

export const STORES = {
  CLAIMS: 'claims',
  COMMENTS: 'comments',
  DOCUMENTS: 'documents',
  PAYMENTS: 'payments',
  PAYMENT_CLAIMS: 'payment_claims',
  PAYMENT_COMMENTS: 'payment_comments',
} as const;

export const INDEXES = {
  CLAIMS: {
    BY_STATUS: 'by-status',
    BY_DATE: 'by-date',
  },
  COMMENTS: {
    BY_CLAIM: 'by-claim',
    BY_DATE: 'by-date',
  },
  DOCUMENTS: {
    BY_CLAIM: 'by-claim',
    BY_CATEGORY: 'by-category',
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