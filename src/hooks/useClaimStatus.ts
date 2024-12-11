import { useState } from 'react';
import { ClaimStatus, Document, StatusChange } from '../types';
import { CLAIM_STATUS_CONFIG } from '../constants/claimStatus';
import { useAuthStore } from '../store/authStore';
import { documentStorage } from '../database/storage/documentStorage';

export function useClaimStatus() {
  const [isUpdating, setIsUpdating] = useState(false);
  const user = useAuthStore(state => state.user);

  const canUpdateStatus = (
    currentStatus: ClaimStatus,
    newStatus: ClaimStatus,
    userRole: 'insurer' | 'admin'
  ): boolean => {
    const statusConfig = CLAIM_STATUS_CONFIG[currentStatus];
    
    // Check if the new status is allowed
    if (!statusConfig.allowedNextStatuses.includes(newStatus)) {
      return false;
    }

    // Check if the user has the required role
    const requiredRole = CLAIM_STATUS_CONFIG[newStatus].requiredRole;
    if (requiredRole === 'both') return true;
    return requiredRole === userRole;
  };

  const updateClaimStatus = async (
    claimId: string,
    newStatus: ClaimStatus,
    comment?: string,
    documents?: File[]
  ): Promise<StatusChange> => {
    if (!user) throw new Error('User not authenticated');

    setIsUpdating(true);
    try {
      // Upload documents if provided
      let uploadedDocs: Document[] = [];
      if (documents && documents.length > 0) {
        uploadedDocs = await Promise.all(
          documents.map(async file => {
            const doc = {
              id: crypto.randomUUID(),
              name: file.name,
              url: URL.createObjectURL(file),
              type: file.type,
              category: newStatus === 'payment_sent' ? 'payment_proof' : 'receipt_confirmation',
              uploadedAt: new Date()
            };
            return await documentStorage.store(doc);
          })
        );
      }

      const statusChange: StatusChange = {
        id: crypto.randomUUID(),
        status: newStatus,
        changedBy: user.id,
        changedAt: new Date(),
        comment,
        documents: uploadedDocs
      };

      return statusChange;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    canUpdateStatus,
    updateClaimStatus,
    isUpdating
  };
}