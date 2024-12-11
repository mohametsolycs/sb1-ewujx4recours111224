import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, FileText, Clock } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/claims/StatusBadge';
import { formatCurrency } from '../../utils/format';
import { useClaims } from '../../hooks/useClaims';
import { INSURANCE_COMPANIES } from '../../constants/insuranceCompanies';
import { documentStorage } from '../../database/storage/documentStorage';
import { LoadingOverlay } from '../../components/ui/spinner';

export function ClaimDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { claims, isLoading } = useClaims();
  
  const claim = claims.find(c => c.id === id);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!claim) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Recours non trouvé</p>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </Layout>
    );
  }

  const getInsuranceCompanyName = (id: string) => {
    return INSURANCE_COMPANIES.find(company => company.id === id)?.name || id;
  };

  const handleDocumentClick = (document) => {
    try {
      documentStorage.openDocument(document);
    } catch (error) {
      console.error('Error opening document:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <StatusBadge status={claim.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">
                  {claim.subject}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(claim.incidentDate).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Créé le {new Date(claim.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{claim.description}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-gray-400" />
                    Assureur demandeur
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-gray-900">
                    {getInsuranceCompanyName(claim.insurerCompanyId)}
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-500">Assuré victime:</p>
                    <p className="text-sm font-medium">{claim.victim.fullName}</p>
                    <p className="text-sm text-gray-500">N° Contrat:</p>
                    <p className="text-sm font-medium">{claim.victim.contractNumber}</p>
                    {claim.victim.contact && (
                      <>
                        <p className="text-sm text-gray-500">Contact:</p>
                        <p className="text-sm font-medium">{claim.victim.contact}</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-gray-400" />
                    Assureur responsable
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-gray-900">
                    {getInsuranceCompanyName(claim.responsibleParty.insuranceCompanyId)}
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-500">Assuré responsable:</p>
                    <p className="text-sm font-medium">{claim.responsibleParty.fullName}</p>
                    <p className="text-sm text-gray-500">N° Contrat:</p>
                    <p className="text-sm font-medium">{claim.responsibleParty.contractNumber}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">
                  Détails financiers
                </h3>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Montant total</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(claim.financialDetails.totalAmount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Franchise</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(claim.financialDetails.deductible)}
                    </dd>
                  </div>
                  <div className="pt-4 border-t">
                    <dt className="text-sm text-gray-500">Montant réclamé</dt>
                    <dd className="text-2xl font-semibold text-primary-600">
                      {formatCurrency(claim.financialDetails.claimedAmount)}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {claim.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-400" />
                    Documents
                  </h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {claim.documents.map(doc => (
                      <li key={doc.id}>
                        <button
                          onClick={() => handleDocumentClick(doc)}
                          className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {doc.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}