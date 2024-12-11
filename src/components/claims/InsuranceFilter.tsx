import React from 'react';
import { Building2 } from 'lucide-react';
import { INSURANCE_COMPANIES } from '../../constants/insuranceCompanies';

interface InsuranceFilterProps {
  selectedCompanyId: string;
  onChange: (companyId: string) => void;
  label: string;
  excludeCompanyId?: string;
}

export function InsuranceFilter({ selectedCompanyId, onChange, label, excludeCompanyId }: InsuranceFilterProps) {
  const companies = excludeCompanyId 
    ? INSURANCE_COMPANIES.filter(company => company.id !== excludeCompanyId)
    : INSURANCE_COMPANIES;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <select
          value={selectedCompanyId}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">Tous les assureurs</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}