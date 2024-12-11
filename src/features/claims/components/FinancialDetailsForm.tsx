import React from 'react';
import { CurrencyInput } from '../../../components/ui/currency-input';
import { formatCurrency } from '../../../utils/format';

interface FinancialDetailsFormProps {
  value: {
    totalAmount: number;
    repairs?: number;
    medicalExpenses?: number;
    otherExpenses?: number;
    deductible: number;
    claimedAmount: number;
  };
  onChange: (values: FinancialDetailsFormProps['value']) => void;
}

export function FinancialDetailsForm({ value, onChange }: FinancialDetailsFormProps) {
  const handleChange = (field: keyof FinancialDetailsFormProps['value'], amount: number) => {
    onChange({ ...value, [field]: amount });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Détails financiers</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="total-amount" className="block text-sm font-medium text-gray-700">
            Montant total payé à la victime
          </label>
          <CurrencyInput
            id="total-amount"
            value={value.totalAmount}
            onChange={(val) => handleChange('totalAmount', val)}
            required
          />
        </div>

        <div>
          <label htmlFor="repairs" className="block text-sm font-medium text-gray-700">
            Réparations
          </label>
          <CurrencyInput
            id="repairs"
            value={value.repairs || 0}
            onChange={(val) => handleChange('repairs', val)}
          />
        </div>

        <div>
          <label htmlFor="medical" className="block text-sm font-medium text-gray-700">
            Frais médicaux
          </label>
          <CurrencyInput
            id="medical"
            value={value.medicalExpenses || 0}
            onChange={(val) => handleChange('medicalExpenses', val)}
          />
        </div>

        <div>
          <label htmlFor="other" className="block text-sm font-medium text-gray-700">
            Autres coûts
          </label>
          <CurrencyInput
            id="other"
            value={value.otherExpenses || 0}
            onChange={(val) => handleChange('otherExpenses', val)}
          />
        </div>

        <div>
          <label htmlFor="deductible" className="block text-sm font-medium text-gray-700">
            Franchise appliquée
          </label>
          <CurrencyInput
            id="deductible"
            value={value.deductible}
            onChange={(val) => handleChange('deductible', val)}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="claimed-amount" className="block text-sm font-medium text-gray-700">
            Montant réclamé
          </label>
          <CurrencyInput
            id="claimed-amount"
            value={value.claimedAmount}
            onChange={(val) => handleChange('claimedAmount', val)}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Montant final demandé à l'assureur fautif
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700">Récapitulatif</h4>
        <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">Total payé</dt>
            <dd className="text-sm font-medium text-gray-900">{formatCurrency(value.totalAmount)}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Franchise</dt>
            <dd className="text-sm font-medium text-gray-900">{formatCurrency(value.deductible)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-gray-500">Montant réclamé</dt>
            <dd className="text-sm font-medium text-gray-900">{formatCurrency(value.claimedAmount)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}