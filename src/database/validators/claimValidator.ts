import { Claim } from '../../types';
import { ValidationError } from '../utils/errors';

export function validateClaim(claim: Claim): void {
  if (!claim.subject?.trim()) {
    throw new ValidationError('Subject is required');
  }

  if (!claim.victim?.fullName?.trim() || !claim.victim?.contractNumber?.trim()) {
    throw new ValidationError('Victim information is incomplete');
  }

  if (!claim.responsibleParty?.fullName?.trim() || 
      !claim.responsibleParty?.contractNumber?.trim() || 
      !claim.responsibleParty?.insuranceCompanyId?.trim()) {
    throw new ValidationError('Responsible party information is incomplete');
  }

  if (!claim.financialDetails?.totalAmount || claim.financialDetails.totalAmount <= 0) {
    throw new ValidationError('Total amount must be greater than 0');
  }

  if (!claim.financialDetails?.claimedAmount || claim.financialDetails.claimedAmount <= 0) {
    throw new ValidationError('Claimed amount must be greater than 0');
  }

  if (!claim.description?.trim()) {
    throw new ValidationError('Description is required');
  }
}