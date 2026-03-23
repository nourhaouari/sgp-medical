// src/app/features/patients/services/patient.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Patient, NiveauUrgence, PATIENTS_DEMO } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  // État interne (mutable, privé)
  private patientsSubject = new BehaviorSubject<Patient[]>(PATIENTS_DEMO);
  private patientCourantSubject = new BehaviorSubject<Patient | null>(null);
  private chargementSubject = new BehaviorSubject<boolean>(false);

  // Observables publics (lecture seule)
  readonly patients$ = this.patientsSubject.asObservable();
  readonly patientCourant$ = this.patientCourantSubject.asObservable();
  readonly enChargement$ = this.chargementSubject.asObservable();

  // Flux dérivés avec opérateurs RxJS
  readonly patientsUrgents$ = this.patients$.pipe(
    map(pts => pts.filter(p => p.niveauUrgence === 'rouge' || p.niveauUrgence === 'orange')),
    distinctUntilChanged()
  );

  readonly statistiques$ = this.patients$.pipe(
    map(pts => ({
      total: pts.length,
      actifs: pts.filter(p => p.statut === 'actif').length,
      urgencesRouge: pts.filter(p => p.niveauUrgence === 'rouge').length,
      urgencesOrange: pts.filter(p => p.niveauUrgence === 'orange').length,
      avecAllergies: pts.filter(p => p.allergies.length > 0).length,
      inactifs: pts.filter(p => p.statut === 'inactif').length,
    }))
  );

  getPatients(): Patient[] {
    return [...this.patientsSubject.getValue()];
  }

  getPatientById(id: string): Patient | undefined {
    return this.patientsSubject.getValue().find(p => p.id === id);
  }

  definirPatientCourant(patient: Patient | null): void {
    this.patientCourantSubject.next(patient);
  }

  rechercherPatients(terme: string): Observable<Patient[]> {
    return this.patients$.pipe(
      map(pts => {
        if (!terme.trim()) return pts;
        const t = terme.toLowerCase();
        return pts.filter(p =>
          p.nom.toLowerCase().includes(t) ||
          p.prenom.toLowerCase().includes(t) ||
          p.ins.includes(t) ||
          p.telephone.includes(t)
        );
      })
    );
  }

  ajouterPatient(patient: Omit<Patient, 'id' | 'dateCreation' | 'dateDerniereModification'>): Patient {
    const nouveau: Patient = {
      ...patient,
      id: crypto.randomUUID(),
      dateCreation: new Date(),
      dateDerniereModification: new Date()
    };
    const actuel = this.patientsSubject.getValue();
    this.patientsSubject.next([...actuel, nouveau]);
    return nouveau;
  }

  mettreAJourPatient(updated: Patient): void {
    const patients = this.patientsSubject.getValue().map(
      p => p.id === updated.id ? { ...updated, dateDerniereModification: new Date() } : p
    );
    this.patientsSubject.next(patients);

    if (this.patientCourantSubject.getValue()?.id === updated.id) {
      this.patientCourantSubject.next(updated);
    }
  }

  supprimerPatient(id: string): void {
    const patients = this.patientsSubject.getValue().filter(p => p.id !== id);
    this.patientsSubject.next(patients);
  }

  modifierNiveauUrgence(id: string, niveau: NiveauUrgence): void {
    const patient = this.getPatientById(id);
    if (patient) this.mettreAJourPatient({ ...patient, niveauUrgence: niveau });
  }
}
