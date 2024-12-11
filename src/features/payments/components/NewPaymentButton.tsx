import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Dialog } from '../../../components/ui/dialog';
import { PaymentForm } from './PaymentForm';
import { Payment } from '../../../types/payment';

interface NewPaymentButtonProps {
  onPaymentCreate: (payment: Omit<Payment, 'id' | 'reference' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function NewPaymentButton({ onPaymentCreate }: NewPaymentButtonProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowForm(true)}
        className="flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Nouveau règlement</span>
      </Button>

      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        className="max-w-4xl"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Nouveau règlement
          </h2>
          <PaymentForm 
            onSubmit={async (data) => {
              await onPaymentCreate(data);
              setShowForm(false);
            }}
          />
        </div>
      </Dialog>
    </>
  );
}