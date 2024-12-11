import React, { useState } from 'react';
import { Dialog } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Payment, PaymentStatus } from '../../../types/payment';
import { formatCurrency } from '../../../utils/format';
import { useAuthStore } from '../../../store/authStore';
import { INSURANCE_COMPANIES } from '../../../constants/insuranceCompanies';
import { StatusBadge } from './StatusBadge';
import { documentStorage } from '../../../database/storage/documentStorage';
import { RelatedClaimsView } from './RelatedClaimsView';

interface PaymentDetailsProps {
  payment: Payment;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: PaymentStatus) => Promise<void>;
  onAddComment: (id: string, content: string) => Promise<void>;
  onViewClaimDetails: (claimId: string) => void;
  type: 'sent' | 'received';
}

export function PaymentDetails({
  payment,
  open,
  onClose,
  onStatusChange,
  onAddComment,
  onViewClaimDetails,
  type
}: PaymentDetailsProps) {
  const [newComment, setNewComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const user = useAuthStore(state => state.user);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        await onAddComment(payment.id, newComment.trim());
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleStatusChange = async (status: PaymentStatus) => {
    try {
      setIsUpdating(true);
      await onStatusChange(payment.id, status);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getCompanyName = (id: string) => {
    return INSURANCE_COMPANIES.find(c => c.id === id)?.name || id;
  };

  const handleDocumentClick = () => {
    if (payment.proofDocument) {
      try {
        documentStorage.openDocument(payment.proofDocument);
      } catch (error) {
        console.error('Error opening document:', error);
      }
    }
  };

  // Only receiver can change status and only when status is 'open'
  const canChangeStatus = type === 'received' && payment.status === 'open';

  return (
    <Dialog open={open} onClose={onClose} className="max-w-4xl">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Règlement {payment.reference}
            </h2>
            <div className="mt-2 flex items-center space-x-4">
              <p className="text-sm text-gray-500">
                {type === 'sent' ? 'Destinataire' : 'Émetteur'}:{' '}
                <span className="font-medium">
                  {getCompanyName(type === 'sent' ? payment.receiverCompanyId : payment.payerCompanyId)}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Date: {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
          <StatusBadge status={payment.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RelatedClaimsView 
              payment={payment}
              onViewClaimDetails={onViewClaimDetails}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Montant</h3>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(payment.amount)}
              </p>
            </div>

            {payment.proofDocument && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Preuve de paiement
                </h3>
                <button
                  onClick={handleDocumentClick}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <span>{payment.proofDocument.name}</span>
                </button>
              </div>
            )}

            {canChangeStatus && (
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleStatusChange('validated')}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isUpdating}
                  >
                    Valider
                  </Button>
                  <Button
                    onClick={() => handleStatusChange('rejected')}
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isUpdating}
                  >
                    Rejeter
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Commentaires
          </h3>
          <div className="space-y-4 mb-4">
            {payment.comments.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun commentaire</p>
            ) : (
              payment.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-900">{comment.authorName}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="flex space-x-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Button
              type="submit"
              disabled={!newComment.trim()}
            >
              Envoyer
            </Button>
          </form>
        </div>
      </div>
    </Dialog>
  );
}