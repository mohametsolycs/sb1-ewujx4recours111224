import { Claim } from '../types';

export function calculateTotalAmount(claims: Claim[]): number {
  return claims.reduce((total, claim) => total + claim.financialDetails.claimedAmount, 0);
}

export function formatIncidentDate(date: Date): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function validateClaimData(data: Partial<Claim>): string[] {
  const errors: string[] = [];

  if (!data.incidentDate) {
    errors.push('La date de sinistre est obligatoire');
  }

  if (!data.victim?.fullName || !data.victim?.contractNumber) {
    errors.push('Les informations de la victime sont incomplètes');
  }

  if (!data.responsibleParty?.fullName || !data.responsibleParty?.contractNumber) {
    errors.push('Les informations de la partie responsable sont incomplètes');
  }

  if (!data.financialDetails?.totalAmount || data.financialDetails.totalAmount <= 0) {
    errors.push('Le montant total doit être supérieur à 0');
  }

  return errors;
}