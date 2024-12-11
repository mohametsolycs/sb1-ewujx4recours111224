import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { useDatabase } from '../../hooks/useDatabase';
import { LoadingOverlay } from '../../components/ui/spinner';
import { useAuthStore } from '../../store/authStore';
import { InsuranceMatrix } from './components/InsuranceMatrix';
import { useClaims } from '../../hooks/useClaims';

export function Dashboard() {
  const { isInitialized } = useDatabase();
  const { claims, isLoading } = useClaims();
  const user = useAuthStore((state) => state.user);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Aperçu des Recours
          </h2>
          <InsuranceMatrix 
            claims={claims.filter(claim => claim.status === 'open')}
            currentInsuranceId={user?.insuranceCompanyId}
          />
        </div>
      </div>
    </Layout>
  );
}