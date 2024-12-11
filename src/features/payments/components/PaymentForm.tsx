import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useClaims } from '../../../hooks/useClaims';
import { formatCurrency } from '../../../utils/format';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { INSURANCE_COMPANIES } from '../../../constants/insuranceCompanies';
import { documentStorage } from '../../../database/storage/documentStorage';
import { ClaimSelectionModal } from './ClaimSelectionModal';
import { useNavigate } from 'react-router-dom';

interface PaymentFormProps {
  onSubmit: (data: any) => Promise<void>;
}

export function PaymentForm({ onSubmit }: PaymentFormProps) {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { claims } = useClaims();
  const [amount, setAmount] = useState<number>(0);
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [receiverCompanyId, setReceiverCompanyId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showClaimSelection, setShowClaimSelection] = useState(false);

  // Get open claims where current company is responsible
  const eligibleClaims = claims.filter(claim => 
    claim.responsibleParty.insuranceCompanyId === user?.insuranceCompanyId &&
    claim.status === 'open'
  );

  // Group claims by insurance company
  const claimsByCompany = eligibleClaims.reduce((acc, claim) => {
    if (!acc[claim.insurerCompanyId]) {
      acc[claim.insurerCompanyId] = [];
    }
    acc[claim.insurerCompanyId].push(claim);
    return acc;
  }, {} as Record<string, typeof claims>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || amount <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }

    if (!receiverCompanyId) {
      setError('Veuillez sélectionner un assureur');
      return;
    }

    if (selectedClaims.length === 0) {
      setError('Veuillez sélectionner au moins un recours');
      return;
    }

    if (!proofFile) {
      setError('Veuillez joindre une preuve de paiement');
      return;
    }

    try {
      const proofDocument = await documentStorage.store(proofFile);
      await onSubmit({
        payerCompanyId: user?.insuranceCompanyId,
        receiverCompanyId,
        amount,
        status: 'open',
        claims: selectedClaims,
        proofDocument,
        comments: [],
        createdBy: user?.id,
      });
    } catch (error) {
      console.error('Failed to create payment:', error);
      setError('Une erreur est survenue lors de la création du règlement');
    }
  };

  const handleViewClaimDetails = (claim) => {
    navigate(`/claims/${claim.id}`);
  };

  const selectedClaimsTotal = claims
    .filter(claim => selectedClaims.includes(claim.id))
    .reduce((sum, claim) => sum + claim.financialDetails.claimedAmount, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assureur bénéficiaire
        </label>
        <select
          value={receiverCompanyId}
          onChange={(e) => {
            setReceiverCompanyId(e.target.value);
            setSelectedClaims([]);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="">Sélectionner un assureur</option>
          {Object.keys(claimsByCompany).map(companyId => {
            const company = INSURANCE_COMPANIES.find(c => c.id === companyId);
            const totalAmount = claimsByCompany[companyId].reduce(
              (sum, claim) => sum + claim.financialDetails.claimedAmount, 
              0
            );
            return (
              <option key={companyId} value={companyId}>
                {company?.name} - {formatCurrency(totalAmount)}
              </option>
            );
          })}
        </select>
      </div>

      {receiverCompanyId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={() => setShowClaimSelection(true)}
              variant="outline"
            >
              Sélectionner les recours
            </Button>
            {selectedClaims.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-500">Total sélectionné: </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(selectedClaimsTotal)}
                </span>
              </div>
            )}
          </div>

          {selectedClaims.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Recours sélectionnés ({selectedClaims.length})
              </h4>
              <div className="space-y-2">
                {claims
                  .filter(claim => selectedClaims.includes(claim.id))
                  .map(claim => (
                    <div
                      key={claim.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{claim.subject}</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(claim.financialDetails.claimedAmount)}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Montant du règlement
        </label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="0"
          step="1"
          required
          className="mt-1"
        />
        {amount > 0 && amount !== selectedClaimsTotal && (
          <p className="mt-1 text-sm text-yellow-600">
            Le montant saisi ({formatCurrency(amount)}) diffère du total des recours sélectionnés ({formatCurrency(selectedClaimsTotal)})
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preuve de paiement
        </label>
        <input
          type="file"
          onChange={(e) => setProofFile(e.target.files?.[0] || null)}
          accept=".pdf,.jpg,.jpeg,.png"
          required
          className="mt-1"
        />
      </div>

      <Button type="submit" className="w-full">
        Créer le règlement
      </Button>

      <ClaimSelectionModal
        claims={eligibleClaims}
        selectedClaims={selectedClaims}
        onClaimSelect={setSelectedClaims}
        onViewDetails={handleViewClaimDetails}
        receiverCompanyId={receiverCompanyId}
        open={showClaimSelection}
        onClose={() => setShowClaimSelection(false)}
      />
    </form>
  );
}