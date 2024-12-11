import { DBSchema } from 'idb';
import { Claim, Comment, Document } from '../../types';

export interface ClaimStore {
  key: string;
  value: Claim;
  indexes: {
    'by-status': string;
    'by-date': Date;
  };
}

export interface CommentStore {
  key: string;
  value: Comment & { claimId: string };
  indexes: {
    'by-claim': string;
    'by-date': Date;
  };
}

export interface DocumentStore {
  key: string;
  value: Document & { claimId: string };
  indexes: {
    'by-claim': string;
    'by-category': string;
  };
}

export interface AppDatabase extends DBSchema {
  claims: ClaimStore;
  comments: CommentStore;
  documents: DocumentStore;
}