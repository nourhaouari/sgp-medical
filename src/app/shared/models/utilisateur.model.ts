// src/app/shared/models/utilisateur.model.ts

export type RoleUtilisateur = 'medecin' | 'infirmier' | 'secretaire' | 'admin';

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: RoleUtilisateur;
  serviceId?: string;
  dateConnexion?: Date;
}

export type AuditAction =
  | 'CONSULTATION_DOSSIER'
  | 'MODIFICATION_PATIENT'
  | 'CREATION_ORDONNANCE'
  | 'VIEW_SENSITIVE'
  | 'EXPORT_DONNEES'
  | 'SUPPRESSION_DONNEES'
  | 'ACCES_REFUSE'
  | 'CONNEXION'
  | 'DECONNEXION'
  | 'URGENCE';

export interface AuditLog {
  timestamp: string;
  utilisateurId: string;
  utilisateurRole: string;
  action: AuditAction;
  patientId?: string;
  details?: string;
  adresseIP: string;
}
