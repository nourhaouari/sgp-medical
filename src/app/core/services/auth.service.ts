// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utilisateur, RoleUtilisateur } from '../../shared/models/utilisateur.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private utilisateurSubject = new BehaviorSubject<Utilisateur | null>(null);
  readonly utilisateur$ = this.utilisateurSubject.asObservable();

  // Simuler un médecin connecté pour la démo
  constructor() {
    const demoUser: Utilisateur = {
      id: 'USR001',
      nom: 'BARBARIA',
      prenom: 'Sabri',
      email: 'sabri.barbaria@hopital.fr',
      role: 'medecin',
      dateConnexion: new Date()
    };
    this.utilisateurSubject.next(demoUser);
  }

  getUtilisateurConnecte(): Utilisateur | null {
    return this.utilisateurSubject.getValue();
  }

  getRole(): RoleUtilisateur {
    return this.utilisateurSubject.getValue()?.role ?? 'secretaire';
  }

  estAuthentifie(): boolean {
    return this.utilisateurSubject.getValue() !== null;
  }

  peutVoirDonneesSensibles(): boolean {
    const role = this.getRole();
    return role === 'medecin' || role === 'admin';
  }

  peutModifierPatient(): boolean {
    const role = this.getRole();
    return role === 'medecin' || role === 'infirmier' || role === 'admin';
  }

  getToken(): string | null {
    // En production : récupérer depuis un stockage sécurisé (pas localStorage!)
    return 'demo-jwt-token-sgp-medical';
  }

  connecter(email: string, motDePasse: string): Observable<boolean> {
    // Simulation - en production : appel API d'authentification
    return new Observable(obs => {
      setTimeout(() => {
        const user: Utilisateur = {
          id: 'USR001',
          nom: 'Utilisateur',
          prenom: 'Demo',
          email,
          role: 'medecin',
          dateConnexion: new Date()
        };
        this.utilisateurSubject.next(user);
        obs.next(true);
        obs.complete();
      }, 500);
    });
  }

  deconnecter(): void {
    this.utilisateurSubject.next(null);
  }
}
