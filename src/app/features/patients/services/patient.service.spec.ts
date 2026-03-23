// src/app/features/patients/services/patient.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { PatientService } from './patient.service';
import { Patient } from '../models/patient.model';

describe('PatientService', () => {
  let service: PatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait charger les patients de démonstration', () => {
    const patients = service.getPatients();
    expect(patients.length).toBeGreaterThan(0);
  });

  it('devrait ajouter un patient', () => {
    const avant = service.getPatients().length;
    service.ajouterPatient({
      ins: '1990101012345',
      nom: 'TEST',
      prenom: 'Patient',
      dateNaissance: new Date('1990-01-01'),
      sexe: 'M',
      adresse: { ligne1: 'Test', codePostal: '75000', ville: 'Paris', pays: 'France' },
      telephone: '06 00 00 00 00',
      medecinTraitantId: 'DR001',
      statut: 'actif',
      allergies: [],
      antecedents: [],
      traitementEnCours: [],
    });
    expect(service.getPatients().length).toBe(avant + 1);
  });

  it('devrait retrouver un patient par ID', () => {
    const patients = service.getPatients();
    const premier = patients[0];
    const trouve = service.getPatientById(premier.id);
    expect(trouve).toEqual(premier);
  });

  it('devrait mettre à jour le niveau d\'urgence', () => {
    const patient = service.getPatients()[0];
    service.modifierNiveauUrgence(patient.id, 'rouge');
    const apres = service.getPatientById(patient.id);
    expect(apres?.niveauUrgence).toBe('rouge');
  });

  it('devrait émettre les statistiques correctes', (done) => {
    service.statistiques$.subscribe(stats => {
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.actifs).toBeGreaterThanOrEqual(0);
      done();
    });
  });
});
