import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { DEMO_USERS, DEMO_PASSWORDS } from '../../constants/users';
import { INSURANCE_COMPANIES } from '../../constants/insuranceCompanies';

export function DemoCredentials() {
  const [isExpanded, setIsExpanded] = useState(false);

  const getInsuranceCompanyName = (id?: string) => {
    if (!id) return '';
    return INSURANCE_COMPANIES.find(company => company.id === id)?.name || id;
  };

  return (
    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-blue-500" />
          <h3 className="text-sm font-medium text-blue-900">Comptes de démonstration</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-blue-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-blue-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-4 mt-4">
          {/* AXA Demo Account */}
          <div className="bg-white p-3 rounded-md shadow-sm">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Compte AXA</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Email:</span> {DEMO_USERS.insurer.email}</p>
              <p><span className="text-gray-500">Mot de passe:</span> {DEMO_PASSWORDS[DEMO_USERS.insurer.email]}</p>
              <p><span className="text-gray-500">Compagnie:</span> {getInsuranceCompanyName(DEMO_USERS.insurer.insuranceCompanyId)}</p>
            </div>
          </div>

          {/* SUNU Demo Account */}
          <div className="bg-white p-3 rounded-md shadow-sm">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Compte SUNU</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Email:</span> {DEMO_USERS.sunu.email}</p>
              <p><span className="text-gray-500">Mot de passe:</span> {DEMO_PASSWORDS[DEMO_USERS.sunu.email]}</p>
              <p><span className="text-gray-500">Compagnie:</span> {getInsuranceCompanyName(DEMO_USERS.sunu.insuranceCompanyId)}</p>
            </div>
          </div>

          {/* Admin Account */}
          <div className="bg-white p-3 rounded-md shadow-sm">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Compte Administrateur</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Email:</span> {DEMO_USERS.admin.email}</p>
              <p><span className="text-gray-500">Mot de passe:</span> {DEMO_PASSWORDS[DEMO_USERS.admin.email]}</p>
              <p><span className="text-gray-500">Rôle:</span> Administrateur AAR</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}