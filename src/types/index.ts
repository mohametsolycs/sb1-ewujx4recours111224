// ... (keep existing imports)

export type ClaimStatus = 'open' | 'closed';

export interface Claim {
  id: string;
  subject: string;
  incidentDate: Date;
  victim: VictimInfo;
  responsibleParty: ResponsiblePartyInfo;
  description: string;
  status: ClaimStatus;
  documents: Document[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  financialDetails: FinancialDetails;
  insurerCompanyId: string; // Creator of the claim
  createdBy: string; // User ID who created the claim
}