import React from 'react';
import { Input } from '../../../components/ui/input';

interface VictimInfoFormProps {
  value: {
    fullName: string;
    contractNumber: string;
    contact?: string;
  };
  onChange: (values: VictimInfoFormProps['value']) => void;
}

export function VictimInfoForm({ value, onChange }: VictimInfoFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Informations sur l'assuré victime</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="victim-name" className="block text-sm font-medium text-gray-700">
            Nom et prénom
          </label>
          <Input
            id="victim-name"
            value={value.fullName}
            onChange={(e) => onChange({ ...value, fullName: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="victim-contract" className="block text-sm font-medium text-gray-700">
            Numéro de contrat
          </label>
          <Input
            id="victim-contract"
            value={value.contractNumber}
            onChange={(e) => onChange({ ...value, contractNumber: e.target.value })}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="victim-contact" className="block text-sm font-medium text-gray-700">
            Contact (téléphone/email)
          </label>
          <Input
            id="victim-contact"
            value={value.contact || ''}
            onChange={(e) => onChange({ ...value, contact: e.target.value })}
            placeholder="Optionnel"
          />
        </div>
      </div>
    </div>
  );
}