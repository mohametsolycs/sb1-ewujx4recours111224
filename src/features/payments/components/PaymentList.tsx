import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Payment, PaymentStatus } from '../../../types/payment';
import { formatCurrency } from '../../../utils/format';
import { PaymentDetails } from './PaymentDetails';
import { INSURANCE_COMPANIES } from '../../../constants/insuranceCompanies';
import { StatusBadge } from './StatusBadge';
import { Card } from '../../../components/ui/card';
import { PaymentCard } from './PaymentCard';

interface PaymentListProps {
  payments: Payment[];
  type: 'sent' | 'received';
  onStatusChange: (id: string, status: PaymentStatus) => Promise<void>;
  onAddComment: (id: string, content: string) => Promise<void>;
}

export function PaymentList({ 
  payments = [],
  type,
  onStatusChange,
  onAddComment
}: PaymentListProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const navigate = useNavigate();

  const handleViewClaimDetails = (claimId: string) => {
    navigate(`/claims/${claimId}`);
  };

  // Early return for empty state
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          {type === 'sent' 
            ? 'Aucun règlement émis pour le moment'
            : 'Aucun règlement reçu pour le moment'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {payments.map((payment) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          type={type}
          onClick={() => setSelectedPayment(payment)}
          onViewClaimDetails={handleViewClaimDetails}
        />
      ))}

      {selectedPayment && (
        <PaymentDetails
          payment={selectedPayment}
          open={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onStatusChange={onStatusChange}
          onAddComment={onAddComment}
          onViewClaimDetails={handleViewClaimDetails}
          type={type}
        />
      )}
    </div>
  );
}