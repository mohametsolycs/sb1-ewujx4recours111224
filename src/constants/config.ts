export const APP_NAME = 'RECOURS';

export const CURRENCY = {
  CODE: 'XOF',
  LOCALE: 'fr-FR',
};

export const AUTH = {
  DEMO_EMAIL: 'demo@example.com',
  DEMO_PASSWORD: 'password',
};

export const TRANSLATIONS = {
  LOGIN: {
    TITLE: 'Connexion',
    EMAIL: 'Adresse e-mail',
    PASSWORD: 'Mot de passe',
    SUBMIT: 'Se connecter',
    DEMO_CREDENTIALS: 'Identifiants de démonstration',
  },
  DASHBOARD: {
    TITLE: 'Gestion des Recours',
    CLAIMS: 'Recours',
    NEW_CLAIM: 'Nouveau Recours',
    NOTIFICATIONS: 'Notifications',
    LOGOUT: 'Déconnexion',
  },
  CLAIMS: {
    AMOUNT: 'Montant (XOF)',
    DESCRIPTION: 'Description',
    DOCUMENTS: 'Documents',
    UPLOAD: 'Télécharger des fichiers',
    FILE_REQUIREMENTS: 'PDF, PNG, JPG jusqu\'à 10MB',
    FILES_SELECTED: 'fichier(s) sélectionné(s)',
    SUBMIT: 'Soumettre le recours',
    STATUS: {
      OPEN: 'En attente',
      IN_REVIEW: 'En cours d\'examen',
      VALIDATED: 'Validé',
      REJECTED: 'Rejeté',
    },
    COMMENTS: {
      TITLE: 'Commentaires',
      ADD: 'Ajouter un commentaire',
      SEND: 'Envoyer',
      NO_COMMENTS: 'Aucun commentaire',
    },
  },
  NOTIFICATIONS: {
    TITLE: 'Notifications',
    NEW: 'Nouveau',
    NO_NOTIFICATIONS: 'Aucune notification',
    CLAIM_SUBMITTED: 'Recours soumis avec succès',
    COMMENT_ADDED: 'Commentaire ajouté avec succès',
  },
};