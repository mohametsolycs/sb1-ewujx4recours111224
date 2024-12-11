import React from 'react';
import { Clock, CheckCircle, Building2 } from 'lucide-react';
import { ClaimStatus } from '../../../types';
import { INSURANCE_COMPANIES } from '../../../constants/insuranceCompanies';

interface AdminFiltersProps {
  filters: {
    status: ClaimStatus;
    insurerCompanyId: string;
    responsibleCompanyId: string;
  };
  onFilterChange: (filters: AdminFiltersProps['filters']) => void;
  totalClaims: number;
}

const statusConfig = {
  open: {
    icon: <Clock className="h-4 w-4" />,
    label: 'En cours',
    color: 'bg-blue-100 text-blue-700',
  },
  closed: {
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'Clôturé',
    color: 'bg-green-100 text-green-700',
  },
};

export function AdminFilters({ filters, onFilterChange, totalClaims }: AdminFiltersProps) {
  return (
    <div className="space-y-6 mb-8">
      {/* Status Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {(Object.entries(statusConfig) as [ClaimStatus, typeof statusConfig.open][]).map(([status, config]) => (
            <button
              key={status}
              onClick={() => onFilterChange({ ...filters, status: status as ClaimStatus })}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                filters.status === status
                  ? config.color
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {config.icon}
              <span>{config.label}</span>
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-500">
          {totalClaims} recours trouvés
        </div>
      </div>

      {/* Insurance Companies Filters */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assureur demandeur
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={filters.insurerCompanyId}
              onChange={(e) => onFilterChange({ ...filters, insurerCompanyId: e.target.value })}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">Tous les assureurs</option>
              {INSURANCE_COMPANIES.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assureur responsable
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={filters.responsibleCompanyId}
              onChange={(e) => onFilterChange({ ...filters, responsibleCompanyId: e.target.value })}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">Tous les assureurs</option>
              {INSURANCE_COMPANIES.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}