import React, { useState } from 'react';
import { FileUp } from 'lucide-react';

interface ClaimFormProps {
  onSubmit: (data: { amount: number; description: string; documents: File[] }) => void;
}

export function ClaimForm({ onSubmit }: ClaimFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: parseFloat(amount),
      description,
      documents,
    });
    // Reset form
    setAmount('');
    setDescription('');
    setDocuments([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount (XOF)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0"
            required
            min="0"
            step="1"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Documents</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <FileUp className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="documents" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                <span>Upload files</span>
                <input
                  id="documents"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(e) => setDocuments(Array.from(e.target.files || []))}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
            {documents.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">{documents.length} file(s) selected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Claim
        </button>
      </div>
    </form>
  );
}