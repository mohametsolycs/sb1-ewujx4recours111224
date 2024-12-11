import React from 'react';
import { Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { Claim, ClaimStatus } from '../types';
import { formatCurrency } from '../utils/format';

interface ClaimListProps {
  claims: Claim[];
}

const statusIcons: Record<ClaimStatus, React.ReactNode> = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  approved: <CheckCircle className="h-5 w-5 text-green-500" />,
  rejected: <XCircle className="h-5 w-5 text-red-500" />,
  paid: <CreditCard className="h-5 w-5 text-blue-500" />,
};

export function ClaimList({ claims }: ClaimListProps) {
  return (
    <div className="space-y-4">
      {claims.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No claims submitted yet</p>
      ) : (
        claims.map((claim) => (
          <div
            key={claim.id}
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {statusIcons[claim.status]}
                <span className="text-lg font-medium">{formatCurrency(claim.amount)}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(claim.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{claim.description}</p>
            {claim.documents.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Documents:</h4>
                <div className="mt-2 space-y-2">
                  {claim.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      className="block text-sm text-blue-600 hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doc.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}