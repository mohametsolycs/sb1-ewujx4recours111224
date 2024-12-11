import { useState, useEffect, useCallback } from 'react';
import { Payment, PaymentStatus } from '../types/payment';
import { useAuthStore } from '../store/authStore';
import { paymentRepository } from '../database/repositories/paymentRepository';
import { useDatabase } from './useDatabase';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const { isInitialized } = useDatabase();

  const loadPayments = useCallback(async () => {
    if (!isInitialized || !user) return;
    
    try {
      setIsLoading(true);
      let loadedPayments;
      
      if (user.role === 'admin') {
        loadedPayments = await paymentRepository.findAll();
      } else if (user.insuranceCompanyId) {
        loadedPayments = await paymentRepository.findByCompany(user.insuranceCompanyId);
      }
      
      setPayments(loadedPayments || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setPayments([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, user]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const createPayment = async (payment: Omit<Payment, 'id' | 'reference' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !isInitialized) {
      throw new Error('User not authenticated or database not initialized');
    }

    const newPayment: Payment = {
      ...payment,
      id: crypto.randomUUID(),
      reference: generatePaymentReference(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'open',
      comments: [],
    };

    try {
      await paymentRepository.create(newPayment);
      await loadPayments();
      return newPayment;
    } catch (error) {
      console.error('Failed to create payment:', error);
      throw error;
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: PaymentStatus) => {
    if (!user || !isInitialized) {
      throw new Error('User not authenticated or database not initialized');
    }

    try {
      await paymentRepository.updateStatus(paymentId, status);
      await loadPayments();
    } catch (error) {
      console.error('Failed to update payment status:', error);
      throw error;
    }
  };

  const addComment = async (paymentId: string, content: string) => {
    if (!user || !isInitialized) {
      throw new Error('User not authenticated or database not initialized');
    }

    const comment = {
      id: crypto.randomUUID(),
      content,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date(),
    };

    try {
      await paymentRepository.addComment(paymentId, comment);
      await loadPayments();
      return comment;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  return {
    payments,
    isLoading,
    createPayment,
    updatePaymentStatus,
    addComment,
  };
}

function generatePaymentReference(): string {
  const prefix = 'PAY';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}