import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { DashboardStats } from './components/DashboardStats';
import { InsuranceMatrix } from './components/InsuranceMatrix';
import { ClaimList } from '../claims/ClaimList';
import { AdminFilters } from './components/AdminFilters';
import { useClaims } from '../../hooks/useClaims';
import { useDatabase } from '../../hooks/useDatabase';
import { LoadingOverlay } from '../../components/ui/spinner';
import { ClaimStatus } from '../../types';

export function AdminDashboard() {
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
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="claims">Recours</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="space-y-6">
            <DashboardStats claims={claims} />
            <InsuranceMatrix claims={claims} />
          </div>
        </TabsContent>

        <TabsContent value="claims">
          <div className="bg-white rounded-lg shadow p-6 relative">
            {isLoading && <LoadingOverlay />}
            
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Gestion des Recours - Administration
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
        </TabsContent>
      </Tabs>
    </Layout>
  );
}