import React from 'react';
import { ClaimStatus } from '../../types';
import { getStatusConfig } from '../../constants/claimStatus';

interface StatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color} ${className}`}>
      <Icon className="h-4 w-4 mr-1" />
      {config.label}
    </span>
  );
}