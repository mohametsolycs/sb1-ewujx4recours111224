import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { Payment } from '../../../types/payment';
import { useClaims } from '../../../hooks/useClaims';
import { formatCurrency } from '../../../utils/format';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardContent } from '../../../components/ui/card';

interface RelatedClaimsViewProps {
  payment: Payment;
  onViewClaimDetails: (claimId: string) => void;
}

export function RelatedClaimsView({ payment, onViewClaimDetails }: RelatedClaimsViewProps) {
  const { claims } = useClaims();
  
  const relatedClaims = claims.filter(claim => 
    payment.claims.includes(claim.id)
  );

  const totalAmount = relatedClaims.reduce(
    (sum, claim) => sum + claim.financialDetails.claimedAmount,
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-400" />
            Recours associés
          </h3>
          <div className="text-sm text-gray-500">
            Total: {formatCurrency(totalAmount)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatedClaims.map(claim => (
            <div
              key={claim.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0 mr-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {claim.subject}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(claim.incidentDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(claim.financialDetails.claimedAmount)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Assuré: {claim.victim.fullName}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewClaimDetails(claim.id)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Voir détails
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}