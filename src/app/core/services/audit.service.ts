// src/app/core/services/audit.service.ts
// Service obligatoire pour la conformité HDS/RGPD
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuditAction, AuditLog } from '../../shared/models/utilisateur.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly auditApiUrl = '/api/audit';
  private readonly logsLocaux: AuditLog[] = []; // Stockage local pour la démo

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  log(action: AuditAction, patientId?: string, details?: string): void {
    const entree: AuditLog = {
      timestamp: new Date().toISOString(),
      utilisateurId: this.authService.getUtilisateurConnecte()?.id ?? 'inconnu',
      utilisateurRole: this.authService.getRole(),
      action,
      patientId,
      details,
      adresseIP: 'client-side', // L'IP réelle est enregistrée côté serveur
    };

    // Stockage local pour la démo
    this.logsLocaux.push(entree);
    console.log('[AUDIT]', entree);

    // En production : envoyer au backend de façon non-bloquante
    // this.http.post(this.auditApiUrl, entree).subscribe({
    //   error: err => console.error('Erreur journalisation audit :', err)
    // });
  }

  getLogs(): AuditLog[] {
    return [...this.logsLocaux];
  }
}
