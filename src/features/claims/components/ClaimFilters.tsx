import React from 'react';
import { Filter, Calendar } from 'lucide-react';
import { ClaimStatus } from '../../../types';
import { Input } from '../../../components/ui/input';
import { InsuranceCompanySelector } from './InsuranceCompanySelector';

interface ClaimFiltersProps {
  status: ClaimStatus | 'all';
  insurerCompanyId: string | 'all';
  responsibleCompanyId: string | 'all';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  onStatusChange: (status: ClaimStatus | 'all') => void;
  onInsurerChange: (insurerId: string) => void;
  onResponsibleChange: (insurerId: string) => void;
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
}

const statusConfig = {
  all: 'Tous les statuts',
  open: 'En attente',
  in_review: 'En cours d\'examen',
  validated: 'Validé',
  rejected: 'Rejeté',
  archived: 'Archivé/Payé'
};

export function ClaimFilters({
  status,
  insurerCompanyId,
  responsibleCompanyId,
  dateRange,
  onStatusChange,
  onInsurerChange,
  onResponsibleChange,
  onDateRangeChange
}: ClaimFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as ClaimStatus | 'all')}
              className="rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {Object.entries(statusConfig).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={dateRange.start?.toISOString().split('T')[0] || ''}
                onChange={(e) => onDateRangeChange({
                  ...dateRange,
                  start: e.target.value ? new Date(e.target.value) : null
                })}
                className="w-32"
              />
              <span className="text-gray-500">à</span>
              <Input
                type="date"
                value={dateRange.end?.toISOString().split('T')[0] || ''}
                onChange={(e) => onDateRangeChange({
                  ...dateRange,
                  end: e.target.value ? new Date(e.target.value) : null
                })}
                className="w-32"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsuranceCompanySelector
            selectedInsurers={{ 
              requester: insurerCompanyId, 
              responsible: responsibleCompanyId 
            }}
            onSelect={(type, value) => {
              if (type === 'requester') {
                onInsurerChange(value || 'all');
              } else {
                onResponsibleChange(value || 'all');
              }
            }}
            onFilter={() => {}}
            onReset={() => {
              onInsurerChange('all');
              onResponsibleChange('all');
            }}
            compact={false}
          />
        </div>
      </div>
    </div>
  );
}