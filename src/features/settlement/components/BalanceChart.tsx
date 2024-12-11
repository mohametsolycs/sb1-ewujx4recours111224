import React from 'react';
import { SettlementSummary } from '../../../types/settlement';
import { formatCurrency } from '../../../utils/format';

interface BalanceChartProps {
  summary: SettlementSummary;
}

export function BalanceChart({ summary }: BalanceChartProps) {
  const maxAmount = Math.max(summary.insurerA.totalAmount, summary.insurerB.totalAmount);
  const scale = maxAmount > 0 ? 100 / maxAmount : 1;

  const getBarWidth = (amount: number) => `${amount * scale}%`;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Balance des recours</h3>
      
      <div className="space-y-8">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{summary.insurerA.name}</span>
            <span>{formatCurrency(summary.insurerA.totalAmount)}</span>
          </div>
          <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: getBarWidth(summary.insurerA.totalAmount) }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{summary.insurerB.name}</span>
            <span>{formatCurrency(summary.insurerB.totalAmount)}</span>
          </div>
          <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: getBarWidth(summary.insurerB.totalAmount) }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Solde net</span>
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrency(summary.netBalance)}
          </span>
        </div>
        {summary.creditor && (
          <p className="mt-2 text-sm text-gray-500 text-right">
            En faveur de {summary.creditor === summary.insurerA.id ? summary.insurerA.name : summary.insurerB.name}
          </p>
        )}
      </div>
    </div>
  );
}