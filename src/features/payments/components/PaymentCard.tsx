import React from 'react';
import { ChevronRight, FileText, Building2 } from 'lucide-react';
import { Payment } from '../../../types/payment';
import { formatCurrency } from '../../../utils/format';
import { StatusBadge } from './StatusBadge';
import { INSURANCE_COMPANIES } from '../../../constants/insuranceCompanies';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useClaims } from '../../../hooks/useClaims';

interface PaymentCardProps {
  payment: Payment;
  type: 'sent' | 'received';
  onClick: () => void;
  onViewClaimDetails: (claimId: string) => void;
}

export function PaymentCard({ payment, type, onClick, onViewClaimDetails }: PaymentCardProps) {
  const { claims } = useClaims();
  const relatedClaims = claims.filter(claim => payment.claims.includes(claim.id));

  const getCompanyName = (id: string) => {
    return INSURANCE_COMPANIES.find(company => company.id === id)?.name || id;
  };

  const counterpartyId = type === 'sent' ? payment.receiverCompanyId : payment.payerCompanyId;

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {payment.reference}
                </h3>
                <StatusBadge status={payment.status} />
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Building2 className="h-4 w-4 mr-2" />
                {type === 'sent' ? 'Destinataire' : 'Émetteur'}: {getCompanyName(counterpartyId)}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  Recours associés ({relatedClaims.length})
                </h4>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {relatedClaims.slice(0, 2).map(claim => (
                  <div
                    key={claim.id}
                    className="bg-gray-50 p-3 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewClaimDetails(claim.id);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {claim.subject}
                        </p>
                        <p className="text-sm text-gray-500">
                          {claim.victim.fullName}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900 ml-4">
                        {formatCurrency(claim.financialDetails.claimedAmount)}
                      </span>
                    </div>
                  </div>
                ))}
                {relatedClaims.length > 2 && (
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center text-sm text-gray-500">
                    +{relatedClaims.length - 2} autres recours
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}