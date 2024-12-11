import React from 'react';
import { Claim } from '../../../types';
import { INSURANCE_COMPANIES } from '../../../constants/insuranceCompanies';
import { formatCurrency } from '../../../utils/format';

interface InsuranceMatrixProps {
  claims: Claim[];
}

export function InsuranceMatrix({ claims }: InsuranceMatrixProps) {
  // Calculate amounts between insurers for open claims only
  const matrix = INSURANCE_COMPANIES.reduce((acc, company) => {
    acc[company.id] = INSURANCE_COMPANIES.reduce((row, col) => {
      row[col.id] = {
        amount: 0,
        count: 0
      };
      return row;
    }, {});
    return acc;
  }, {});

  // Fill matrix with open claim amounts
  claims.filter(claim => claim.status === 'open').forEach(claim => {
    const cell = matrix[claim.insurerCompanyId][claim.responsibleParty.insuranceCompanyId];
    cell.amount += claim.financialDetails.claimedAmount;
    cell.count += 1;
  });

  // Calculate totals
  const totals = INSURANCE_COMPANIES.reduce((acc, company) => {
    acc[company.id] = {
      toReceive: INSURANCE_COMPANIES.reduce((sum, other) => 
        sum + matrix[company.id][other.id].amount, 0
      ),
      toPay: INSURANCE_COMPANIES.reduce((sum, other) => 
        sum + matrix[other.id][company.id].amount, 0
      )
    };
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Matrice des recours en cours</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Demandeur ↓ / Responsable →
              </th>
              {INSURANCE_COMPANIES.map(company => (
                <th key={company.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {company.name}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total à recevoir
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {INSURANCE_COMPANIES.map(rowCompany => (
              <tr key={rowCompany.id}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {rowCompany.name}
                </td>
                {INSURANCE_COMPANIES.map(colCompany => {
                  const cell = matrix[rowCompany.id][colCompany.id];
                  return (
                    <td key={colCompany.id} className="px-4 py-3 text-sm">
                      {rowCompany.id === colCompany.id ? (
                        <span className="text-gray-400">-</span>
                      ) : cell.count > 0 ? (
                        <div>
                          <div className="text-blue-600 font-medium">
                            {formatCurrency(cell.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {cell.count} recours
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-sm font-medium text-blue-600">
                  {formatCurrency(totals[rowCompany.id].toReceive)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                Total à payer
              </td>
              {INSURANCE_COMPANIES.map(company => (
                <td key={company.id} className="px-4 py-3 text-sm font-medium text-red-600">
                  {formatCurrency(totals[company.id].toPay)}
                </td>
              ))}
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}