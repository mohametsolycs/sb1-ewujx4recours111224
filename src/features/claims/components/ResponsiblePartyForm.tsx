import React from 'react';
import { Input } from '../../../components/ui/input';
import { INSURANCE_COMPANIES } from '../../../constants/insuranceCompanies';

interface ResponsiblePartyFormProps {
  value: {
    fullName: string;
    contractNumber: string;
    insuranceCompanyId: string;
  };
  onChange: (values: ResponsiblePartyFormProps['value']) => void;
}

export function ResponsiblePartyForm({ value, onChange }: ResponsiblePartyFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Informations sur l'assuré fautif</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="responsible-name" className="block text-sm font-medium text-gray-700">
            Nom et prénom
          </label>
          <Input
            id="responsible-name"
            value={value.fullName}
            onChange={(e) => onChange({ ...value, fullName: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="responsible-contract" className="block text-sm font-medium text-gray-700">
            Numéro de contrat
          </label>
          <Input
            id="responsible-contract"
            value={value.contractNumber}
            onChange={(e) => onChange({ ...value, contractNumber: e.target.value })}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="insurance-company" className="block text-sm font-medium text-gray-700">
            Assureur responsable
          </label>
          <select
            id="insurance-company"
            value={value.insuranceCompanyId}
            onChange={(e) => onChange({ ...value, insuranceCompanyId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          >
            <option value="">Sélectionnez un assureur</option>
            {INSURANCE_COMPANIES.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}