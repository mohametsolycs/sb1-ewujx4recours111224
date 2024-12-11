import React, { useState } from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Claim } from '../../../types';
import { formatCurrency } from '../../../utils/format';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Dialog } from '../../../components/ui/dialog';
import { INSURANCE_COMPANIES } from '../../../constants/insuranceCompanies';

interface ClaimSelectionModalProps {
  claims: Claim[];
  selectedClaims: string[];
  onClaimSelect: (claimIds: string[]) => void;
  onViewDetails: (claim: Claim) => void;
  receiverCompanyId: string;
  open: boolean;
  onClose: () => void;
}

export function ClaimSelectionModal({
  claims,
  selectedClaims,
  onClaimSelect,
  onViewDetails,
  receiverCompanyId,
  open,
  onClose
}: ClaimSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredClaims = claims
    .filter(claim => {
      // Filter by receiver company
      if (claim.insurerCompanyId !== receiverCompanyId) return false;
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          claim.subject.toLowerCase().includes(query) ||
          claim.victim.fullName.toLowerCase().includes(query) ||
          claim.victim.contractNumber.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.financialDetails.claimedAmount - a.financialDetails.claimedAmount;
    });

  const totalSelected = selectedClaims.reduce((sum, id) => {
    const claim = claims.find(c => c.id === id);
    return sum + (claim?.financialDetails.claimedAmount || 0);
  }, 0);

  return (
    <Dialog open={open} onClose={onClose} className="max-w-4xl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Sélection des recours
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {selectedClaims.length} recours sélectionnés
            </span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(totalSelected)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher par référence, assuré ou contrat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="date">Date</option>
              <option value="amount">Montant</option>
            </select>
          </div>
        </div>

        <div className="border rounded-lg divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="p-4 hover:bg-gray-50 flex items-center justify-between"
            >
              <div className="flex-1 min-w-0 mr-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedClaims.includes(claim.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onClaimSelect([...selectedClaims, claim.id]);
                        } else {
                          onClaimSelect(selectedClaims.filter(id => id !== claim.id));
                        }
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {claim.subject}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(claim.incidentDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(claim.financialDetails.claimedAmount)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Assuré: {claim.victim.fullName} ({claim.victim.contractNumber})
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(claim)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Voir détails
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredClaims.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Aucun recours trouvé
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onClose}>
            Valider la sélection
          </Button>
        </div>
      </div>
    </Dialog>
  );
}