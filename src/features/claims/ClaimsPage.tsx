import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { ClaimForm } from './ClaimForm';
import { ClaimList } from './ClaimList';
import { StatusFilter } from '../../components/claims/StatusFilter';
import { InsuranceFilter } from '../../components/claims/InsuranceFilter';
import { Layout } from '../../components/layout/Layout';
import { useDatabase } from '../../hooks/useDatabase';
import { LoadingOverlay } from '../../components/ui/spinner';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { useClaims } from '../../hooks/useClaims';
import { ClaimStatus } from '../../types';

export function ClaimsPage() {
  const { isInitialized } = useDatabase();
  const { claims, addClaim, addComment, updateClaimStatus, isLoading } = useClaims();
  const [showNewClaimForm, setShowNewClaimForm] = React.useState(false);
  const [currentStatus, setCurrentStatus] = useState<ClaimStatus>('open');
  const [responsibleCompanyId, setResponsibleCompanyId] = useState('all');
  const [requesterCompanyId, setRequesterCompanyId] = useState('all');
  const user = useAuthStore((state) => state.user);

  // Filter claims based on the user's role, company, status and selected filters
  const createdClaims = claims.filter(claim => {
    if (claim.insurerCompanyId !== user?.insuranceCompanyId) return false;
    if (claim.status !== currentStatus) return false;
    if (responsibleCompanyId !== 'all' && 
        claim.responsibleParty.insuranceCompanyId !== responsibleCompanyId) return false;
    return true;
  });
  
  const receivedClaims = claims.filter(claim => {
    if (claim.responsibleParty.insuranceCompanyId !== user?.insuranceCompanyId) return false;
    if (claim.insurerCompanyId === user?.insuranceCompanyId) return false;
    if (claim.status !== currentStatus) return false;
    if (requesterCompanyId !== 'all' && claim.insurerCompanyId !== requesterCompanyId) return false;
    return true;
  });

  // Calculate counts for status filter
  const getStatusCounts = (claimsList: typeof claims) => ({
    open: claimsList.filter(c => c.status === 'open').length,
    closed: claimsList.filter(c => c.status === 'closed').length,
  });

  const createdStatusCounts = getStatusCounts(claims.filter(claim => 
    claim.insurerCompanyId === user?.insuranceCompanyId &&
    (responsibleCompanyId === 'all' || claim.responsibleParty.insuranceCompanyId === responsibleCompanyId)
  ));

  const receivedStatusCounts = getStatusCounts(claims.filter(claim => 
    claim.responsibleParty.insuranceCompanyId === user?.insuranceCompanyId &&
    claim.insurerCompanyId !== user?.insuranceCompanyId &&
    (requesterCompanyId === 'all' || claim.insurerCompanyId === requesterCompanyId)
  ));

  const handleClaimSubmit = async (data: any) => {
    if (!user) return;

    const newClaim = {
      ...data,
      id: crypto.randomUUID(),
      status: 'open' as ClaimStatus,
      insurerCompanyId: user.insuranceCompanyId,
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    };

    try {
      await addClaim(newClaim);
      setShowNewClaimForm(false);
    } catch (error) {
      console.error('Failed to create claim:', error);
    }
  };

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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Gestion des recours
          </h2>
          
          <Button
            onClick={() => setShowNewClaimForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau recours</span>
          </Button>
        </div>

        <Tabs defaultValue="created" className="space-y-6">
          <TabsList>
            <TabsTrigger value="created">Mes recours créés</TabsTrigger>
            <TabsTrigger value="received">Recours reçus</TabsTrigger>
          </TabsList>

          <TabsContent value="created">
            <div className="space-y-6">
              <StatusFilter
                currentStatus={currentStatus}
                onStatusChange={setCurrentStatus}
                counts={createdStatusCounts}
              />
              <div className="mb-6">
                <InsuranceFilter
                  selectedCompanyId={responsibleCompanyId}
                  onChange={setResponsibleCompanyId}
                  label="Filtrer par assureur responsable"
                  excludeCompanyId={user?.insuranceCompanyId}
                />
              </div>
              <ClaimList 
                claims={createdClaims}
                onAddComment={addComment}
                onUpdateStatus={updateClaimStatus}
                isLoading={isLoading}
                canEdit={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="received">
            <div className="space-y-6">
              <StatusFilter
                currentStatus={currentStatus}
                onStatusChange={setCurrentStatus}
                counts={receivedStatusCounts}
              />
              <div className="mb-6">
                <InsuranceFilter
                  selectedCompanyId={requesterCompanyId}
                  onChange={setRequesterCompanyId}
                  label="Filtrer par assureur demandeur"
                  excludeCompanyId={user?.insuranceCompanyId}
                />
              </div>
              <ClaimList 
                claims={receivedClaims}
                onAddComment={addComment}
                isLoading={isLoading}
                canEdit={false}
              />
            </div>
          </TabsContent>
        </Tabs>

        {showNewClaimForm && (
          <Dialog
            open={showNewClaimForm}
            onClose={() => setShowNewClaimForm(false)}
            className="max-w-4xl"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Nouveau recours
              </h2>
              <ClaimForm onSubmit={handleClaimSubmit} />
            </div>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}