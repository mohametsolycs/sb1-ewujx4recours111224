import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { ClaimStatus } from '../../types';

interface StatusFilterProps {
  currentStatus: ClaimStatus;
  onStatusChange: (status: ClaimStatus) => void;
  counts: {
    open: number;
    closed: number;
  };
}

const statusConfig = {
  open: {
    icon: <Clock className="h-4 w-4" />,
    label: 'En cours',
    color: 'bg-blue-100 text-blue-700',
  },
  closed: {
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'Clôturé',
    color: 'bg-green-100 text-green-700',
  },
};

export function StatusFilter({ currentStatus, onStatusChange, counts }: StatusFilterProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      {(Object.entries(statusConfig) as [ClaimStatus, typeof statusConfig.open][]).map(([status, config]) => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            currentStatus === status
              ? config.color
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {config.icon}
          <span>{config.label}</span>
          <span className="ml-2 bg-white bg-opacity-50 px-2 py-0.5 rounded-full text-sm">
            {counts[status]}
          </span>
        </button>
      ))}
    </div>
  );
}