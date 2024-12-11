import { getDatabase } from '../database/db';

export async function viewDatabaseContents() {
  try {
    const db = await getDatabase();
    
    console.group('Contenu de la base de données');
    
    // Afficher les recours
    const claims = await db.getAll('claims');
    console.group('Recours');
    claims.forEach(claim => {
      console.group(`Recours ID: ${claim.id}`);
      console.log('Objet:', claim.subject);
      console.log('Statut:', claim.status);
      console.log('Montant réclamé:', claim.financialDetails.claimedAmount, 'XOF');
      console.log('Créé le:', new Date(claim.createdAt).toLocaleString('fr-FR'));
      console.log('Documents:', claim.documents.length);
      console.log('Commentaires:', claim.comments.length);
      console.groupEnd();
    });
    console.groupEnd();

    // Afficher les notifications
    const notifications = await db.getAll('notifications');
    console.group('Notifications');
    notifications.forEach(notification => {
      console.group(`Notification ID: ${notification.id}`);
      console.log('Type:', notification.type);
      console.log('Message:', notification.message);
      console.log('Lu:', notification.read ? 'Oui' : 'Non');
      console.log('Créé le:', new Date(notification.createdAt).toLocaleString('fr-FR'));
      if (notification.userId) console.log('Utilisateur:', notification.userId);
      if (notification.relatedClaimId) console.log('Recours lié:', notification.relatedClaimId);
      console.groupEnd();
    });
    console.groupEnd();

    console.groupEnd();
  } catch (error) {
    console.error('Erreur lors de l\'affichage de la base de données:', error);
  }
}