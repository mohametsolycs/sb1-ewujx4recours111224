import { ClaimStatus } from '../types';
import { Clock, CheckCircle } from 'lucide-react';

export const CLAIM_STATUS_CONFIG: Record<ClaimStatus, {
  label: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}> = {
  open: {
    label: 'En cours',
    description: 'Recours en cours de traitement',
    icon: Clock,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  closed: {
    label: 'Clôturé',
    description: 'Recours clôturé',
    icon: CheckCircle,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  }
};

export const getStatusConfig = (status: ClaimStatus) => {
  return CLAIM_STATUS_CONFIG[status] || CLAIM_STATUS_CONFIG.open;
};