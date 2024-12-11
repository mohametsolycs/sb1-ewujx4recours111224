import { executeQuery } from '../utils/sqlCommands';
import { Claim, Comment, ClaimStatus } from '../../types';
import { DatabaseError } from '../utils/errors';
import { validateClaim } from '../validators/claimValidator';

export const claimRepository = {
  async create(claim: Claim): Promise<void> {
    validateClaim(claim);
    try {
      await executeQuery({
        table: 'claims',
        type: 'INSERT',
        data: {
          ...claim,
          createdAt: new Date(),
          updatedAt: new Date(),
          documents: claim.documents || [],
          comments: claim.comments || [],
        },
      });
    } catch (error) {
      console.error('Failed to create claim:', error);
      throw new DatabaseError('Failed to create claim');
    }
  },

  async findAll(): Promise<Claim[]> {
    try {
      const claims = await executeQuery({
        table: 'claims',
        type: 'SELECT',
      });
      return claims.sort((a: Claim, b: Claim) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch claims:', error);
      throw new DatabaseError('Failed to fetch claims');
    }
  },

  async findByInsurer(insurerCompanyId: string): Promise<Claim[]> {
    try {
      const claims = await executeQuery({
        table: 'claims',
        type: 'SELECT',
        conditions: { insurerCompanyId }
      });
      return claims.sort((a: Claim, b: Claim) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch claims by insurer:', error);
      throw new DatabaseError('Failed to fetch claims by insurer');
    }
  },

  async addComment(claimId: string, comment: Comment): Promise<void> {
    try {
      const claims = await this.findAll();
      const claim = claims.find(c => c.id === claimId);
      if (!claim) {
        throw new DatabaseError('Claim not found');
      }

      const updatedClaim = {
        ...claim,
        comments: [...claim.comments, comment],
        updatedAt: new Date(),
      };

      await executeQuery({
        table: 'claims',
        type: 'UPDATE',
        conditions: { id: claimId },
        data: updatedClaim,
      });
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw new DatabaseError('Failed to add comment');
    }
  },

  async updateStatus(claimId: string, status: ClaimStatus): Promise<void> {
    try {
      const claims = await this.findAll();
      const claim = claims.find(c => c.id === claimId);
      if (!claim) {
        throw new DatabaseError('Claim not found');
      }

      await executeQuery({
        table: 'claims',
        type: 'UPDATE',
        conditions: { id: claimId },
        data: { ...claim, status, updatedAt: new Date() },
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      throw new DatabaseError('Failed to update claim status');
    }
  },

  async delete(claimId: string): Promise<void> {
    try {
      const claims = await this.findAll();
      const claim = claims.find(c => c.id === claimId);
      if (!claim) {
        throw new DatabaseError('Claim not found');
      }

      await executeQuery({
        table: 'claims',
        type: 'DELETE',
        conditions: { id: claimId },
      });
    } catch (error) {
      console.error('Failed to delete claim:', error);
      throw new DatabaseError('Failed to delete claim');
    }
  }
};