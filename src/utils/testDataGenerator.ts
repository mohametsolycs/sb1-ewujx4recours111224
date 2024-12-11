import { Claim, ClaimStatus } from '../types';
import { INSURANCE_COMPANIES } from '../constants/insuranceCompanies';

const STATUS_DISTRIBUTION: ClaimStatus[] = [
  'open', 'open', 'open',  // 30% open
  'in_review', 'in_review', // 20% in review
  'validated', 'validated', 'validated', // 30% validated
  'rejected', 'rejected' // 20% rejected
];

const AMOUNTS = [
  50000, 100000, 250000, 500000, 750000, 
  1000000, 1500000, 2000000, 2500000, 3000000
];

function generateRandomClaim(insurerCompanyId: string): Claim {
  // Get a random company different from the insurer
  const otherCompanies = INSURANCE_COMPANIES.filter(c => c.id !== insurerCompanyId);
  const responsibleCompany = otherCompanies[Math.floor(Math.random() * otherCompanies.length)];
  
  const totalAmount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
  const deductible = Math.floor(totalAmount * 0.1); // 10% deductible
  const claimedAmount = totalAmount - deductible;

  // Generate a random date within the last 6 months
  const date = new Date();
  date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));

  return {
    id: Math.random().toString(36).substring(2, 15),
    subject: `Sinistre automobile du ${date.toLocaleDateString('fr-FR')}`,
    victim: {
      fullName: `Assuré ${Math.random().toString(36).substring(2, 8)}`,
      contractNumber: `POL${Math.floor(Math.random() * 1000000)}`,
      contact: `+221 7${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 100)}`
    },
    responsibleParty: {
      fullName: `Tiers ${Math.random().toString(36).substring(2, 8)}`,
      contractNumber: `POL${Math.floor(Math.random() * 1000000)}`,
      insuranceCompanyId: responsibleCompany.id
    },
    description: 'Collision entre deux véhicules avec dégâts matériels',
    status: STATUS_DISTRIBUTION[Math.floor(Math.random() * STATUS_DISTRIBUTION.length)],
    documents: [],
    comments: [],
    createdAt: date,
    updatedAt: date,
    financialDetails: {
      totalAmount,
      repairs: Math.floor(totalAmount * 0.8),
      medicalExpenses: Math.floor(totalAmount * 0.15),
      otherExpenses: Math.floor(totalAmount * 0.05),
      deductible,
      claimedAmount
    },
    insurerCompanyId
  };
}

export function generateTestData(): Claim[] {
  const claims: Claim[] = [];
  
  // Generate 100 claims for each insurance company
  INSURANCE_COMPANIES.forEach(company => {
    for (let i = 0; i < 100; i++) {
      claims.push(generateRandomClaim(company.id));
    }
  });

  return claims;
}