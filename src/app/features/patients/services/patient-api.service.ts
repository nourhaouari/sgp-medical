// src/app/features/patients/services/patient-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import {
  Patient, ConstantesVitales,
  FhirPatient, FhirBundle
} from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly fhirBaseUrl = 'https://api.fhir.sante.gouv.fr/r4';

  constructor(private http: HttpClient) {}

  // GET - Recherche patients (paramètres de recherche FHIR)
  rechercherPatients(params: {
    nom?: string;
    prenom?: string;
    dateNaissance?: string;
    _count?: number;
  }): Observable<Patient[]> {
    let httpParams = new HttpParams();
    if (params.nom) httpParams = httpParams.set('family', params.nom);
    if (params.prenom) httpParams = httpParams.set('given', params.prenom);
    if (params.dateNaissance) httpParams = httpParams.set('birthdate', params.dateNaissance);
    httpParams = httpParams.set('_count', params._count ?? 20);

    return this.http.get<FhirBundle<FhirPatient>>(`${this.fhirBaseUrl}/Patient`, {
      params: httpParams,
      headers: { Accept: 'application/fhir+json' }
    }).pipe(
      map(bundle => bundle.entry?.map(e => this.fhirVersPatient(e.resource)) ?? []),
      retry(2),
      catchError(this.gererErreur)
    );
  }

  // GET - Dossier patient complet
  getDossierPatient(id: string): Observable<Patient> {
    return this.http.get<FhirPatient>(`${this.fhirBaseUrl}/Patient/${id}`).pipe(
      map(fhir => this.fhirVersPatient(fhir)),
      catchError(this.gererErreur)
    );
  }

  // GET - Observations (constantes vitales)
  getConstantesVitales(patientId: string): Observable<ConstantesVitales[]> {
    const params = new HttpParams()
      .set('patient', patientId)
      .set('category', 'vital-signs')
      .set('_sort', '-date')
      .set('_count', '10');

    return this.http.get<any>(`${this.fhirBaseUrl}/Observation`, { params }).pipe(
      map(b => b.entry?.map((e: any) => this.fhirVersConstantes(e.resource)) ?? []),
      catchError(this.gererErreur)
    );
  }

  // POST - Créer un patient
  creerPatient(patient: Patient): Observable<Patient> {
    return this.http.post<FhirPatient>(
      `${this.fhirBaseUrl}/Patient`,
      this.patientVersFhir(patient),
      { headers: { 'Content-Type': 'application/fhir+json' } }
    ).pipe(
      map(fhir => this.fhirVersPatient(fhir)),
      catchError(this.gererErreur)
    );
  }

  // PUT - Mettre à jour un patient
  mettreAJourPatient(patient: Patient): Observable<Patient> {
    return this.http.put<FhirPatient>(
      `${this.fhirBaseUrl}/Patient/${patient.id}`,
      this.patientVersFhir(patient),
      { headers: { 'Content-Type': 'application/fhir+json' } }
    ).pipe(
      map(fhir => this.fhirVersPatient(fhir)),
      catchError(this.gererErreur)
    );
  }

  private gererErreur(error: any): Observable<never> {
    let message = 'Erreur serveur inattendue';
    if (error.status === 0) message = 'Connexion impossible au serveur FHIR';
    if (error.status === 401) message = 'Session expirée - reconnectez-vous';
    if (error.status === 403) message = 'Accès refusé - droits insuffisants';
    if (error.status === 404) message = 'Ressource introuvable';
    console.error('[PatientApiService]', error);
    return throwError(() => new Error(message));
  }

  // Mapping FHIR R4 → Patient interne
  private fhirVersPatient(fhir: FhirPatient): Patient {
    return {
      id: fhir.id,
      ins: fhir.identifier?.find(i => i.system === 'urn:oid:1.2.250.1.213.1.4.8')?.value ?? '',
      nom: fhir.name?.[0]?.family ?? '',
      prenom: fhir.name?.[0]?.given?.[0] ?? '',
      dateNaissance: new Date(fhir.birthDate),
      sexe: fhir.gender === 'male' ? 'M' : 'F',
      adresse: {
        ligne1: fhir.address?.[0]?.line?.[0] ?? '',
        codePostal: fhir.address?.[0]?.postalCode ?? '',
        ville: fhir.address?.[0]?.city ?? '',
        pays: fhir.address?.[0]?.country ?? 'France'
      },
      telephone: fhir.telecom?.find(t => t.system === 'phone')?.value ?? '',
      email: fhir.telecom?.find(t => t.system === 'email')?.value,
      medecinTraitantId: '',
      statut: fhir.active ? 'actif' : 'inactif',
      allergies: [],
      antecedents: [],
      traitementEnCours: [],
      dateCreation: new Date(),
      dateDerniereModification: new Date()
    } as Patient;
  }

  // Mapping Patient interne → FHIR R4
  private patientVersFhir(patient: Patient): FhirPatient {
    return {
      resourceType: 'Patient',
      id: patient.id,
      identifier: [{ system: 'urn:oid:1.2.250.1.213.1.4.8', value: patient.ins }],
      name: [{ family: patient.nom, given: [patient.prenom] }],
      birthDate: new Date(patient.dateNaissance).toISOString().split('T')[0],
      gender: patient.sexe === 'M' ? 'male' : 'female',
      active: patient.statut === 'actif',
      telecom: [
        { system: 'phone', value: patient.telephone },
        ...(patient.email ? [{ system: 'email', value: patient.email }] : [])
      ],
      address: [{
        line: [patient.adresse.ligne1],
        postalCode: patient.adresse.codePostal,
        city: patient.adresse.ville,
        country: patient.adresse.pays
      }]
    };
  }

  private fhirVersConstantes(fhir: any): ConstantesVitales {
    return {
      dateMesure: new Date(fhir.effectiveDateTime ?? new Date()),
      saturationO2: fhir.code?.coding?.[0]?.code === '59408-5'
        ? fhir.valueQuantity?.value : undefined
    };
  }
}
