import React, { useState } from 'react';
import { VictimInfoForm } from './components/VictimInfoForm';
import { ResponsiblePartyForm } from './components/ResponsiblePartyForm';
import { FinancialDetailsForm } from './components/FinancialDetailsForm';
import { DocumentUpload } from '../../components/documents/DocumentUpload';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Document } from '../../types';

interface ClaimFormProps {
  onSubmit: (data: {
    subject: string;
    incidentDate: Date;
    victim: VictimInfo;
    responsibleParty: ResponsiblePartyInfo;
    financialDetails: FinancialDetails;
    description: string;
    documents: Document[];
  }) => void;
}

export function ClaimForm({ onSubmit }: ClaimFormProps) {
  const [subject, setSubject] = useState('');
  const [incidentDate, setIncidentDate] = useState<Date>(new Date());
  const [victim, setVictim] = useState<VictimInfo>({
    fullName: '',
    contractNumber: '',
    contact: '',
  });

  const [responsibleParty, setResponsibleParty] = useState<ResponsiblePartyInfo>({
    fullName: '',
    contractNumber: '',
    insuranceCompanyId: '',
  });

  const [financialDetails, setFinancialDetails] = useState<FinancialDetails>({
    totalAmount: 0,
    repairs: 0,
    medicalExpenses: 0,
    otherExpenses: 0,
    deductible: 0,
    claimedAmount: 0,
  });

  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!subject.trim()) {
      setError('Veuillez saisir l\'objet de la demande');
      return;
    }

    if (!incidentDate) {
      setError('Veuillez saisir la date du sinistre');
      return;
    }

    if (!victim.fullName || !victim.contractNumber) {
      setError('Veuillez remplir toutes les informations de la victime');
      return;
    }

    if (!responsibleParty.fullName || !responsibleParty.contractNumber || !responsibleParty.insuranceCompanyId) {
      setError('Veuillez remplir toutes les informations de la partie responsable');
      return;
    }

    if (financialDetails.totalAmount <= 0 || financialDetails.claimedAmount <= 0) {
      setError('Les montants doivent être supérieurs à 0');
      return;
    }

    onSubmit({
      subject,
      incidentDate,
      victim,
      responsibleParty,
      financialDetails,
      description,
      documents,
    });

    // Reset form
    setSubject('');
    setIncidentDate(new Date());
    setVictim({ fullName: '', contractNumber: '', contact: '' });
    setResponsibleParty({ fullName: '', contractNumber: '', insuranceCompanyId: '' });
    setFinancialDetails({
      totalAmount: 0,
      repairs: 0,
      medicalExpenses: 0,
      otherExpenses: 0,
      deductible: 0,
      claimedAmount: 0,
    });
    setDescription('');
    setDocuments([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="subject" className="block text-lg font-medium text-gray-900 mb-2">
          Objet de la demande
        </label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex: Accident de la circulation du 12/03/2024"
          required
          className="text-lg"
        />
      </div>

      <div>
        <label htmlFor="incidentDate" className="block text-lg font-medium text-gray-900 mb-2">
          Date du sinistre
        </label>
        <Input
          id="incidentDate"
          type="date"
          value={incidentDate.toISOString().split('T')[0]}
          onChange={(e) => setIncidentDate(new Date(e.target.value))}
          required
          className="text-lg"
        />
      </div>

      <VictimInfoForm value={victim} onChange={setVictim} />
      
      <div className="border-t border-gray-200 pt-8">
        <ResponsiblePartyForm value={responsibleParty} onChange={setResponsibleParty} />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <FinancialDetailsForm value={financialDetails} onChange={setFinancialDetails} />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Description détaillée</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Décrivez les circonstances et détails du sinistre..."
            required
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <DocumentUpload
          documents={documents}
          onDocumentsChange={setDocuments}
        />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <Button
          type="submit"
          className="w-full flex justify-center py-2 px-4"
        >
          Soumettre le recours
        </Button>
      </div>
    </form>
  );
}