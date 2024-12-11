import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ClaimList } from '../claims/ClaimList';
import { useClaims } from '../../hooks/useClaims';
import { useDatabase } from '../../hooks/useDatabase';
import { LoadingOverlay } from '../../components/ui/spinner';
import { AdminFilters } from '../admin/components/AdminFilters';
import { useState } from 'react';
import { ClaimStatus } from '../../types';

export function AssociationDashboard() {
  const { isInitialized } = useDatabase();
  const { claims, addComment, isLoading } = useClaims();
  const [filters, setFilters] = useState({
    status: 'open' as ClaimStatus,
    insurerCompanyId: 'all',
    responsibleCompanyId: 'all'
  });

  // Filter claims based on selected criteria
  const filteredClaims = claims.filter(claim => {
    // Status filter
    if (filters.status !== claim.status) {
      return false;
    }

    // Insurer company filter
    if (filters.insurerCompanyId !== 'all' && 
        claim.insurerCompanyId !== filters.insurerCompanyId) {
      return false;
    }

    // Responsible company filter
    if (filters.responsibleCompanyId !== 'all' && 
        claim.responsibleParty.insuranceCompanyId !== filters.responsibleCompanyId) {
      return false;
    }

    return true;
  });

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6 relative">
        {isLoading && <LoadingOverlay />}

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Gestion des Recours
        </h1>

        <AdminFilters
          filters={filters}
          onFilterChange={setFilters}
          totalClaims={filteredClaims.length}
        />

        <ClaimList
          claims={filteredClaims}
          onAddComment={addComment}
          isLoading={isLoading}
          canEdit={false}
        />
      </div>
    </Layout>
  );
}