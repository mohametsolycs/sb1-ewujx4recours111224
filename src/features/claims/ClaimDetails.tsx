import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  MessageSquare, 
  Send,
  Paperclip
} from 'lucide-react';
import { Claim } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { INSURANCE_COMPANIES } from '../../constants/insuranceCompanies';
import { StatusBadge } from '../../components/claims/StatusBadge';
import { documentStorage } from '../../database/storage/documentStorage';

interface ClaimDetailsProps {
  claim: Claim;
  open: boolean;
  onClose: () => void;
  onAddComment: (claimId: string, content: string) => void;
  onUpdateStatus?: (claimId: string, newStatus: string) => void;
  canEdit: boolean;
}

export function ClaimDetails({ 
  claim, 
  open, 
  onClose, 
  onAddComment, 
  onUpdateStatus,
  canEdit
}: ClaimDetailsProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        await onAddComment(claim.id, newComment.trim());
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdateStatus) {
      onUpdateStatus(claim.id, e.target.value);
    }
  };

  const getInsuranceCompanyName = (id: string): string => {
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
    <Dialog open={open} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{claim.subject}</h2>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">
                  Soumis par {getInsuranceCompanyName(claim.insurerCompanyId)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Sinistre du {new Date(claim.incidentDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Créé le {new Date(claim.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
          
          {canEdit && (
            <select
              value={claim.status}
              onChange={handleStatusChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="open">En cours</option>
              <option value="closed">Clôturé</option>
            </select>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <StatusBadge status={claim.status} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Victime</h3>
            <div className="mt-2 space-y-1">
              <p className="text-gray-900">{claim.victim.fullName}</p>
              <p className="text-sm text-gray-500">Contrat : {claim.victim.contractNumber}</p>
              {claim.victim.contact && (
                <p className="text-sm text-gray-500">Contact : {claim.victim.contact}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Partie responsable</h3>
            <div className="mt-2 space-y-1">
              <p className="text-gray-900">{claim.responsibleParty.fullName}</p>
              <p className="text-sm text-gray-500">Contrat : {claim.responsibleParty.contractNumber}</p>
              <p className="text-sm text-gray-500">
                Assureur : {getInsuranceCompanyName(claim.responsibleParty.insuranceCompanyId)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Montant total</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatCurrency(claim.financialDetails.totalAmount)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Montant réclamé</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatCurrency(claim.financialDetails.claimedAmount)}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-1 text-gray-900">{claim.description}</p>
        </div>

        {claim.documents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
            <div className="space-y-2">
              {claim.documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc)}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Paperclip className="h-4 w-4" />
                  <span>{doc.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Commentaires</span>
          </h3>

          <div className="space-y-4 mb-6">
            {claim.comments.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun commentaire</p>
            ) : (
              claim.comments.map((comment) => (
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
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              type="submit"
              disabled={!newComment.trim()}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Envoyer</span>
            </Button>
          </form>
        </div>
      </div>
    </Dialog>
  );
}