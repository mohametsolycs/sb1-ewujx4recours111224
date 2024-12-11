import React from 'react';
import { FileUp, Receipt, FileText, FileSignature, Image } from 'lucide-react';
import { DOCUMENT_CATEGORIES } from '../../constants/documents';
import { Document } from '../../types';

interface DocumentUploadProps {
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
}

export function DocumentUpload({ documents, onDocumentsChange }: DocumentUploadProps) {
  const handleFileChange = (category: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocuments = files.map(file => ({
      id: Math.random().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      category,
      uploadedAt: new Date(),
    }));

    onDocumentsChange([...documents, ...newDocuments]);
  };

  const handleRemoveDocument = (documentId: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== documentId));
  };

  const getIconForCategory = (iconName: string) => {
    switch (iconName) {
      case 'Receipt':
        return <Receipt className="h-6 w-6" />;
      case 'FileText':
        return <FileText className="h-6 w-6" />;
      case 'FileSignature':
        return <FileSignature className="h-6 w-6" />;
      case 'Image':
        return <Image className="h-6 w-6" />;
      default:
        return <FileUp className="h-6 w-6" />;
    }
  };

  const getDocumentsByCategory = (category: string) => {
    return documents.filter(doc => doc.category === category);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Documents justificatifs</h3>
        <p className="mt-1 text-sm text-gray-500">
          Veuillez fournir les documents nécessaires pour appuyer votre demande de recours
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {DOCUMENT_CATEGORIES.map((category) => (
          <div
            key={category.id}
            className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 text-gray-400">
                {getIconForCategory(category.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-gray-900">
                  {category.label}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  {category.description}
                </p>
                
                <div className="mt-4">
                  <label className="inline-flex items-center px-4 py-2 border border-primary-500 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 cursor-pointer">
                    <FileUp className="h-4 w-4 mr-2" />
                    <span>Ajouter des fichiers</span>
                    <input
                      type="file"
                      multiple
                      className="sr-only"
                      accept={category.acceptedFormats}
                      onChange={(e) => handleFileChange(category.id, e)}
                    />
                  </label>
                </div>

                {/* Liste des documents téléchargés pour cette catégorie */}
                {getDocumentsByCategory(category.id).length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Documents téléchargés :
                    </h5>
                    <ul className="divide-y divide-gray-200">
                      {getDocumentsByCategory(category.id).map((doc) => (
                        <li key={doc.id} className="py-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <FileUp className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">{doc.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(doc.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Supprimer
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 px-4 py-3 rounded-md">
        <h4 className="text-sm font-medium text-gray-900">Formats acceptés</h4>
        <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
          <li>Documents PDF (rapports, factures, constats)</li>
          <li>Images JPG ou PNG (photos des dommages)</li>
          <li>Taille maximale par fichier : 10 MB</li>
        </ul>
      </div>
    </div>
  );
}