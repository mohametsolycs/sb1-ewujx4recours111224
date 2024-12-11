import React from 'react';
import { PaymentStatus } from '../../../types/payment';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig = {
  open: {
    icon: Clock,
    label: 'En attente',
    color: 'bg-blue-100 text-blue-800',
  },
  validated: {
    icon: CheckCircle,
    label: 'Validé',
    color: 'bg-green-100 text-green-800',
  },
  rejected: {
    icon: XCircle,
    label: 'Rejeté',
    color: 'bg-red-100 text-red-800',
  },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className="h-4 w-4 mr-1" />
      {config.label}
    </span>
  );
}