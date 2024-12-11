import { useState } from 'react';
import { SettlementSummary } from '../types/settlement';
import { claimRepository } from '../database/repositories/claimRepository';
import { INSURANCE_COMPANIES } from '../constants/insuranceCompanies';

export function useSettlement(
  dateRange: { start: Date; end: Date }, 
  selectedInsurers: { insurerA: string | null; insurerB: string | null }
) {
  const [settlementSummary, setSettlementSummary] = useState<SettlementSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateSettlement = async () => {
    if (!selectedInsurers.insurerA || !selectedInsurers.insurerB) {
      setSettlementSummary(null);
      return;
    }

    setIsLoading(true);
    try {
      const claims = await claimRepository.findAll();
      
      // Filter claims by date range and relevant insurers
      const relevantClaims = claims.filter(claim => {
        const claimDate = new Date(claim.createdAt);
        return claimDate >= dateRange.start && 
               claimDate <= dateRange.end && 
               ((claim.insurerCompanyId === selectedInsurers.insurerA && 
                 claim.responsibleParty.insuranceCompanyId === selectedInsurers.insurerB) ||
                (claim.insurerCompanyId === selectedInsurers.insurerB && 
                 claim.responsibleParty.insuranceCompanyId === selectedInsurers.insurerA)) &&
               claim.status !== 'validated'; // Only include unprocessed claims
      });

      // Group claims by insurer
      const insurerAClaims = relevantClaims.filter(
        claim => claim.insurerCompanyId === selectedInsurers.insurerA
      );
      const insurerBClaims = relevantClaims.filter(
        claim => claim.insurerCompanyId === selectedInsurers.insurerB
      );

      // Calculate totals
      const totalAmountA = insurerAClaims.reduce(
        (sum, claim) => sum + claim.financialDetails.claimedAmount, 
        0
      );
      const totalAmountB = insurerBClaims.reduce(
        (sum, claim) => sum + claim.financialDetails.claimedAmount, 
        0
      );

      const netBalance = totalAmountA - totalAmountB;
      const creditor = netBalance > 0 ? selectedInsurers.insurerA : 
                      netBalance < 0 ? selectedInsurers.insurerB : 
                      null;

      setSettlementSummary({
        insurerA: {
          id: selectedInsurers.insurerA,
          name: INSURANCE_COMPANIES.find(c => c.id === selectedInsurers.insurerA)?.name || selectedInsurers.insurerA,
          totalAmount: totalAmountA,
          claims: insurerAClaims,
        },
        insurerB: {
          id: selectedInsurers.insurerB,
          name: INSURANCE_COMPANIES.find(c => c.id === selectedInsurers.insurerB)?.name || selectedInsurers.insurerB,
          totalAmount: totalAmountB,
          claims: insurerBClaims,
        },
        netBalance: Math.abs(netBalance),
        creditor,
      });
    } catch (error) {
      console.error('Failed to calculate settlement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSettlement = async () => {
    if (!settlementSummary) return;

    setIsLoading(true);
    try {
      // Update all claims to validated status
      const allClaims = [
        ...settlementSummary.insurerA.claims,
        ...settlementSummary.insurerB.claims
      ];

      // Update claims in parallel
      await Promise.all(
        allClaims.map(claim => 
          claimRepository.updateStatus(claim.id, 'validated')
        )
      );

      // Reset the settlement summary after processing
      setSettlementSummary(null);

      // Recalculate to get fresh data
      await calculateSettlement();
    } catch (error) {
      console.error('Failed to generate settlement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (format: 'pdf' | 'xlsx') => {
    if (!settlementSummary) return;

    try {
      // TODO: Implement export functionality
      console.log(`Exporting data in ${format} format`);
    } catch (error) {
      console.error(`Failed to export data as ${format}:`, error);
    }
  };

  return {
    settlementSummary,
    calculateSettlement,
    generateSettlement,
    exportData,
    isLoading,
  };
}