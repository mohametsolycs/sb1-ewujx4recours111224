import React from 'react';
import { Claim } from '../../../types';
import { INSURANCE_COMPANIES } from '../../../constants/insuranceCompanies';
import { formatCurrency } from '../../../utils/format';

interface InsuranceMatrixProps {
  claims: Claim[];
  currentInsuranceId?: string;
}

export function InsuranceMatrix({ claims, currentInsuranceId }: InsuranceMatrixProps) {
  if (!currentInsuranceId) return null;

  // Get current insurance company details
  const currentCompany = INSURANCE_COMPANIES.find(c => c.id === currentInsuranceId);
  if (!currentCompany) return null;

  // Get other insurance companies
  const otherCompanies = INSURANCE_COMPANIES.filter(c => c.id !== currentInsuranceId);

  // Calculate amounts for claims involving the current insurance company
  const relevantClaims = claims.filter(claim => 
    claim.insurerCompanyId === currentInsuranceId || 
    claim.responsibleParty.insuranceCompanyId === currentInsuranceId
  );

  // Initialize matrix for current insurance company
  const matrix = {
    asRequester: {} as Record<string, { amount: number; count: number }>,
    asResponsible: {} as Record<string, { amount: number; count: number }>,
  };

  // Initialize entries for all other companies
  otherCompanies.forEach(company => {
    matrix.asRequester[company.id] = { amount: 0, count: 0 };
    matrix.asResponsible[company.id] = { amount: 0, count: 0 };
  });

  // Fill matrix with claim data
  relevantClaims.forEach(claim => {
    if (claim.insurerCompanyId === currentInsuranceId) {
      // Current company is the requester
      const cell = matrix.asRequester[claim.responsibleParty.insuranceCompanyId];
      if (cell) {
        cell.amount += claim.financialDetails.claimedAmount;
        cell.count += 1;
      }
    } else if (claim.responsibleParty.insuranceCompanyId === currentInsuranceId) {
      // Current company is responsible
      const cell = matrix.asResponsible[claim.insurerCompanyId];
      if (cell) {
        cell.amount += claim.financialDetails.claimedAmount;
        cell.count += 1;
      }
    }
  });

  // Calculate totals
  const totals = {
    toReceive: Object.values(matrix.asRequester).reduce((sum, cell) => sum + cell.amount, 0),
    toPay: Object.values(matrix.asResponsible).reduce((sum, cell) => sum + cell.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Montant à recevoir</h3>
          <p className="text-2xl font-bold text-blue-700">{formatCurrency(totals.toReceive)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-900 mb-2">Montant à payer</h3>
          <p className="text-2xl font-bold text-red-700">{formatCurrency(totals.toPay)}</p>
        </div>
      </div>

      {/* Detailed Matrix */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assureur
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-blue-600 uppercase tracking-wider">
                À recevoir
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-red-600 uppercase tracking-wider">
                À payer
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solde
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {otherCompanies.map(company => {
              const toReceive = matrix.asRequester[company.id].amount;
              const toPay = matrix.asResponsible[company.id].amount;
              const balance = toReceive - toPay;
              
              return (
                <tr key={company.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {matrix.asRequester[company.id].count > 0 ? (
                      <div>
                        <div className="font-medium text-blue-600">
                          {formatCurrency(toReceive)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {matrix.asRequester[company.id].count} recours
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {matrix.asResponsible[company.id].count > 0 ? (
                      <div>
                        <div className="font-medium text-red-600">
                          {formatCurrency(toPay)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {matrix.asResponsible[company.id].count} recours
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-right">
                    {balance !== 0 && (
                      <span className={balance > 0 ? 'text-blue-600' : 'text-red-600'}>
                        {formatCurrency(Math.abs(balance))}
                        {balance > 0 ? ' (CR)' : ' (DR)'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}