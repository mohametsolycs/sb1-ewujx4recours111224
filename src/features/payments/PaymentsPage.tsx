import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { PaymentList } from './components/PaymentList';
import { NewPaymentButton } from './components/NewPaymentButton';
import { usePayments } from '../../hooks/usePayments';
import { useAuthStore } from '../../store/authStore';
import { LoadingOverlay } from '../../components/ui/spinner';

export function PaymentsPage() {
  const { payments = [], isLoading, createPayment, updatePaymentStatus, addComment } = usePayments();
  const user = useAuthStore(state => state.user);

  // Filter payments only if they exist and user is authenticated
  const receivedPayments = user?.insuranceCompanyId 
    ? payments.filter(p => p.receiverCompanyId === user.insuranceCompanyId) 
    : [];
  const sentPayments = user?.insuranceCompanyId
    ? payments.filter(p => p.payerCompanyId === user.insuranceCompanyId)
    : [];

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6 relative">
        {isLoading && <LoadingOverlay />}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Gestion des règlements
          </h2>
          <NewPaymentButton onPaymentCreate={createPayment} />
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList>
            <TabsTrigger value="received">Règlements reçus</TabsTrigger>
            <TabsTrigger value="sent">Règlements émis</TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <PaymentList 
              payments={receivedPayments}
              type="received"
              onStatusChange={updatePaymentStatus}
              onAddComment={addComment}
            />
          </TabsContent>

          <TabsContent value="sent">
            <PaymentList 
              payments={sentPayments}
              type="sent"
              onStatusChange={updatePaymentStatus}
              onAddComment={addComment}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}