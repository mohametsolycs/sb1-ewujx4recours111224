import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';

interface TotalAmountProps {
  amount: number;
  count: number;
}

export function TotalAmount({ amount, count }: TotalAmountProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-2 bg-primary-100 rounded-lg">
          <TrendingUp className="h-6 w-6 text-primary-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total des recours</p>
          <p className="text-2xl font-semibold text-gray-900">{formatCurrency(amount)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">{count} recours</p>
      </div>
    </div>
  );
}