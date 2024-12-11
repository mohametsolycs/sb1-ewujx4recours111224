import React, { useState } from 'react';
import { Claim } from '../../types';
import { formatCurrency } from '../../utils/format';
import { ClaimDetails } from './ClaimDetails';
import { useAuthStore } from '../../store/authStore';
import { INSURANCE_COMPANIES } from '../../constants/insuranceCompanies';
import { Spinner } from '../../components/ui/spinner';
import { StatusBadge } from '../../components/claims/StatusBadge';

interface ClaimListProps {
  claims: Claim[];
  onAddComment: (claimId: string, content: string) => void;
  onUpdateStatus?: (claimId: string, newStatus: string) => void;
  isLoading?: boolean;
  canEdit: boolean;
}

export function ClaimList({
  claims,
  onAddComment,
  onUpdateStatus,
  isLoading,
  canEdit
}: ClaimListProps) {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const user = useAuthStore((state) => state.user);

  const getInsuranceCompanyName = (id: string) => {
    return INSURANCE_COMPANIES.find(company => company.id === id)?.name || id;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500">Chargement des recours...</p>
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun recours trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assureur demandeur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assureur responsable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant réclamé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date sinistre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date création
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {claims.map((claim) => (
              <tr
                key={claim.id}
                onClick={() => setSelectedClaim(claim)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {claim.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={claim.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getInsuranceCompanyName(claim.insurerCompanyId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getInsuranceCompanyName(claim.responsibleParty.insuranceCompanyId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(claim.financialDetails.claimedAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(claim.incidentDate).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(claim.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClaim && (
        <ClaimDetails
          claim={selectedClaim}
          open={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onAddComment={onAddComment}
          onUpdateStatus={canEdit ? onUpdateStatus : undefined}
          canEdit={canEdit && selectedClaim.createdBy === user?.id}
        />
      )}
    </div>
  );
}