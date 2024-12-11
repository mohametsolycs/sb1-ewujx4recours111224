import { executeQuery } from '../utils/sqlCommands';
import { Payment, PaymentStatus } from '../../types/payment';
import { DatabaseError } from '../utils/errors';
import { claimRepository } from './claimRepository';
import { STORES } from '../config';

export const paymentRepository = {
  async findAll(): Promise<Payment[]> {
    try {
      const payments = await executeQuery({
        table: STORES.PAYMENTS,
        type: 'SELECT',
      });
      return payments || [];
    } catch (error) {
      console.error('Failed to fetch all payments:', error);
      throw new DatabaseError('Failed to fetch payments');
    }
  },

  async findByCompany(companyId: string): Promise<Payment[]> {
    try {
      const payments = await executeQuery({
        table: STORES.PAYMENTS,
        type: 'SELECT',
      });
      return (payments || []).filter(p => 
        p.payerCompanyId === companyId || p.receiverCompanyId === companyId
      );
    } catch (error) {
      console.error('Failed to fetch payments by company:', error);
      throw new DatabaseError('Failed to fetch payments');
    }
  },

  async create(payment: Payment): Promise<void> {
    try {
      await executeQuery({
        table: STORES.PAYMENTS,
        type: 'INSERT',
        data: {
          ...payment,
          status: 'open' as PaymentStatus,
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to create payment:', error);
      throw new DatabaseError('Failed to create payment');
    }
  },

  async updateStatus(paymentId: string, status: PaymentStatus): Promise<void> {
    try {
      // Get the payment first
      const payments = await executeQuery({
        table: STORES.PAYMENTS,
        type: 'SELECT',
        conditions: { id: paymentId }
      });
      const payment = payments?.[0];

      if (!payment) {
        throw new DatabaseError('Payment not found');
      }

      const updatedPayment = {
        ...payment,
        status,
        updatedAt: new Date(),
        validatedAt: status === 'validated' ? new Date() : undefined
      };

      // Update payment status
      await executeQuery({
        table: STORES.PAYMENTS,
        type: 'UPDATE',
        conditions: { id: paymentId },
        data: updatedPayment,
      });

      // If payment is validated, close all related claims
      if (status === 'validated' && payment.claims?.length > 0) {
        const comment = {
          id: crypto.randomUUID(),
          content: `Recours clôturé automatiquement suite à la validation du règlement ${payment.reference}`,
          authorId: 'system',
          authorName: 'Système',
          createdAt: new Date(),
        };

        // Update each claim status to closed
        for (const claimId of payment.claims) {
          await claimRepository.updateStatus(claimId, 'closed');
          await claimRepository.addComment(claimId, comment);
        }
      }
    } catch (error) {
      console.error('Failed to update payment status:', error);
      throw new DatabaseError('Failed to update payment status');
    }
  },

  async addComment(paymentId: string, comment: any): Promise<void> {
    try {
      const payments = await executeQuery({
        table: STORES.PAYMENTS,
        type: 'SELECT',
        conditions: { id: paymentId }
      });
      const payment = payments?.[0];

      if (!payment) {
        throw new DatabaseError('Payment not found');
      }

      const updatedPayment = {
        ...payment,
        comments: [...(payment.comments || []), comment],
        updatedAt: new Date(),
      };

      await executeQuery({
        table: STORES.PAYMENTS,
        type: 'UPDATE',
        conditions: { id: paymentId },
        data: updatedPayment,
      });
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw new DatabaseError('Failed to add comment');
    }
  },
};