import React, { useState, useRef, useEffect } from 'react';
import { Search, Building2 } from 'lucide-react';
import { INSURANCE_COMPANIES } from '../../../constants/insuranceCompanies';
import { Button } from '../../../components/ui/button';

interface InsuranceCompanySelectorProps {
  selectedInsurers: {
    requester: string | 'all';
    responsible: string | 'all';
  };
  onSelect: (type: 'requester' | 'responsible', value: string) => void;
  onFilter: () => void;
  onReset: () => void;
  compact?: boolean;
}

export function InsuranceCompanySelector({
  selectedInsurers,
  onSelect,
  onFilter,
  onReset,
  compact = false
}: InsuranceCompanySelectorProps) {
  const [searchQuery, setSearchQuery] = useState({ requester: '', responsible: '' });
  const [isOpen, setIsOpen] = useState({ requester: false, responsible: false });
  const dropdownRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current.requester && !dropdownRef.current.requester.contains(event.target as Node)) {
        setIsOpen(prev => ({ ...prev, requester: false }));
      }
      if (dropdownRef.current.responsible && !dropdownRef.current.responsible.contains(event.target as Node)) {
        setIsOpen(prev => ({ ...prev, responsible: false }));
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCompanies = {
    requester: INSURANCE_COMPANIES.filter(company =>
      company.name.toLowerCase().includes(searchQuery.requester.toLowerCase()) &&
      company.id !== selectedInsurers.responsible
    ),
    responsible: INSURANCE_COMPANIES.filter(company =>
      company.name.toLowerCase().includes(searchQuery.responsible.toLowerCase()) &&
      company.id !== selectedInsurers.requester
    )
  };

  const handleSearch = (type: 'requester' | 'responsible', value: string) => {
    setSearchQuery(prev => ({ ...prev, [type]: value }));
  };

  const handleSelect = (type: 'requester' | 'responsible', companyId: string) => {
    onSelect(type, companyId);
    setIsOpen(prev => ({ ...prev, [type]: false }));
    setSearchQuery(prev => ({ ...prev, [type]: '' }));
  };

  const renderDropdown = (type: 'requester' | 'responsible') => (
    <div
      ref={el => dropdownRef.current[type] = el}
      className="relative"
    >
      <div
        className="flex items-center w-full px-3 py-2 border rounded-md cursor-pointer hover:border-primary-500"
        onClick={() => setIsOpen(prev => ({ ...prev, [type]: !prev[type] }))}
      >
        <Building2 className="h-5 w-5 text-gray-400 mr-2" />
        <span className="flex-1 truncate">
          {selectedInsurers[type] !== 'all'
            ? INSURANCE_COMPANIES.find(c => c.id === selectedInsurers[type])?.name
            : `Sélectionner un assureur ${type === 'requester' ? 'demandeur' : 'responsable'}`}
        </span>
      </div>

      {isOpen[type] && (
        <div className="absolute z-10 w-64 mt-1 bg-white rounded-md shadow-lg border">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Rechercher..."
                value={searchQuery[type]}
                onChange={(e) => handleSearch(type, e.target.value)}
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(type, 'all')}
            >
              Tous les assureurs
            </li>
            {filteredCompanies[type].map(company => (
              <li
                key={company.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(type, company.id)}
              >
                {company.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assureur demandeur
          </label>
          {renderDropdown('requester')}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assureur responsable
          </label>
          {renderDropdown('responsible')}
        </div>
      </div>
    </div>
  );
}