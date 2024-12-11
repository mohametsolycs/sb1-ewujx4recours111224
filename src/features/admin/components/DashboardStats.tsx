import React from 'react';
import { Claim } from '../../../types';
import { FileText, Clock } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';

interface DashboardStatsProps {
  claims: Claim[];
}

export function DashboardStats({ claims }: DashboardStatsProps) {
  const openClaims = claims.filter(c => c.status === 'open');
  const totalOpenClaims = openClaims.length;
  const totalAmount = openClaims.reduce(
    (sum, claim) => sum + claim.financialDetails.claimedAmount, 
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total des recours en cours</p>
            <p className="text-2xl font-semibold text-gray-900">{totalOpenClaims}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Montant total en cours</p>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}