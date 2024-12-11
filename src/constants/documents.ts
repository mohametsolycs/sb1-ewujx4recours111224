export const DOCUMENT_CATEGORIES = [
  {
    id: 'invoice',
    label: 'Factures ou devis',
    description: 'Documents attestant des frais engagés',
    acceptedFormats: '.pdf,.jpg,.jpeg,.png',
    icon: 'Receipt',
  },
  {
    id: 'expertise',
    label: 'Rapport d\'expertise',
    description: 'Rapport d\'un expert agréé sur les circonstances et les responsabilités',
    acceptedFormats: '.pdf',
    icon: 'FileText',
  },
  {
    id: 'statement',
    label: 'Constat amiable',
    description: 'Document signé par les parties impliquées',
    acceptedFormats: '.pdf,.jpg,.jpeg,.png',
    icon: 'FileSignature',
  },
  {
    id: 'photo',
    label: 'Photos ou vidéos',
    description: 'Éléments visuels prouvant les dommages',
    acceptedFormats: '.jpg,.jpeg,.png',
    icon: 'Image',
  },
  {
    id: 'payment',
    label: 'Preuve de paiement',
    description: 'Justificatifs de paiement ou de virement',
    acceptedFormats: '.pdf,.jpg,.jpeg,.png',
    icon: 'Receipt',
  },
];