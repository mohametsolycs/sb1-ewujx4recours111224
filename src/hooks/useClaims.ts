import { useState, useEffect, useCallback } from 'react';
import { Claim, Comment, ClaimStatus } from '../types';
import { useAuthStore } from '../store/authStore';
import { claimRepository } from '../database/repositories/claimRepository';
import { useDatabase } from './useDatabase';

export function useClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const { isInitialized } = useDatabase();

  const loadClaims = useCallback(async () => {
    if (!isInitialized || !user) return;
    
    try {
      setIsLoading(true);
      let loadedClaims;
      
      if (user.role === 'admin') {
        // Admin sees all claims
        loadedClaims = await claimRepository.findAll();
      } else {
        // Regular users only see claims where they are involved
        loadedClaims = await claimRepository.findAll();
        loadedClaims = loadedClaims.filter(claim => 
          claim.insurerCompanyId === user.insuranceCompanyId || 
          claim.responsibleParty.insuranceCompanyId === user.insuranceCompanyId
        );
      }
      
      setClaims(loadedClaims);
    } catch (error) {
      console.error('Failed to fetch claims:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, user]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  const addClaim = async (claim: Claim) => {
    if (!user || !isInitialized) {
      throw new Error('User not authenticated or database not initialized');
    }

    try {
      await claimRepository.create(claim);
      await loadClaims(); // Reload claims after adding new one
      return claim;
    } catch (error) {
      console.error('Failed to create claim:', error);
      throw error;
    }
  };

  const addComment = async (claimId: string, content: string) => {
    if (!user || !isInitialized) {
      throw new Error('User not authenticated or database not initialized');
    }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      content,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date(),
    };

    try {
      await claimRepository.addComment(claimId, newComment);
      await loadClaims();
      return newComment;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const updateClaimStatus = async (claimId: string, newStatus: ClaimStatus) => {
    if (!user || !isInitialized) {
      throw new Error('User not authenticated or database not initialized');
    }

    try {
      await claimRepository.updateStatus(claimId, newStatus);
      await loadClaims();
    } catch (error) {
      console.error('Failed to update claim status:', error);
      throw error;
    }
  };

  return {
    claims,
    isLoading,
    addClaim,
    addComment,
    updateClaimStatus,
    loadClaims,
  };
}