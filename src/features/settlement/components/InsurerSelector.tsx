import React from 'react';

interface InsurerSelectorProps {
  insurers: Array<{ id: string; name: string }>;
  selectedInsurers: {
    insurerA: string | null;
    insurerB: string | null;
  };
  onChange: (selected: { insurerA: string | null; insurerB: string | null }) => void;
}

export function InsurerSelector({ 
  insurers, 
  selectedInsurers, 
  onChange 
}: InsurerSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="insurer-a" className="block text-sm font-medium text-gray-700">
          Premier assureur
        </label>
        <select
          id="insurer-a"
          value={selectedInsurers.insurerA || ''}
          onChange={(e) => onChange({
            ...selectedInsurers,
            insurerA: e.target.value || null
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Sélectionner un assureur</option>
          {insurers.map((insurer) => (
            <option
              key={insurer.id}
              value={insurer.id}
              disabled={insurer.id === selectedInsurers.insurerB}
            >
              {insurer.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="insurer-b" className="block text-sm font-medium text-gray-700">
          Second assureur
        </label>
        <select
          id="insurer-b"
          value={selectedInsurers.insurerB || ''}
          onChange={(e) => onChange({
            ...selectedInsurers,
            insurerB: e.target.value || null
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Sélectionner un assureur</option>
          {insurers.map((insurer) => (
            <option
              key={insurer.id}
              value={insurer.id}
              disabled={insurer.id === selectedInsurers.insurerA}
            >
              {insurer.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}