import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { SettlementSummary as SettlementSummaryType } from '../../../types/settlement';
import { formatCurrency } from '../../../utils/format';

interface SettlementSummaryProps {
  summary: SettlementSummaryType;
}

export function SettlementSummary({ summary }: SettlementSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2" />
        Résumé du règlement
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">{summary.insurerA.name}</h4>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {formatCurrency(summary.insurerA.totalAmount)}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {summary.insurerA.claims.length} recours
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-center">
            <ArrowRight className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm font-medium text-gray-500">
              Solde net
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatCurrency(summary.netBalance)}
            </p>
            {summary.creditor && (
              <p className="mt-1 text-sm text-gray-500">
                En faveur de {summary.creditor === summary.insurerA.id ? summary.insurerA.name : summary.insurerB.name}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">{summary.insurerB.name}</h4>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {formatCurrency(summary.insurerB.totalAmount)}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {summary.insurerB.claims.length} recours
          </p>
        </div>
      </div>
    </div>
  );
}