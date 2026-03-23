// src/app/features/patients/components/patient-card/patient-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientCardComponent } from './patient-card.component';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Patient } from '../../models/patient.model';

describe('PatientCardComponent', () => {
  let component: PatientCardComponent;
  let fixture: ComponentFixture<PatientCardComponent>;

  const patientDemo: Patient = {
    id: '1',
    ins: '1850612075047',
    nom: 'DUPONT',
    prenom: 'Jean',
    dateNaissance: new Date('1985-06-12'),
    sexe: 'M',
    groupeSanguin: 'A+',
    adresse: { ligne1: '12 Rue de la Paix', codePostal: '75001', ville: 'Paris', pays: 'France' },
    telephone: '06 12 34 56 78',
    medecinTraitantId: 'DR001',
    statut: 'actif',
    niveauUrgence: 'vert',
    allergies: [],
    antecedents: [],
    traitementEnCours: [],
    dateCreation: new Date(),
    dateDerniereModification: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientCardComponent],
      imports: [SharedModule, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientCardComponent);
    component = fixture.componentInstance;
    component.patient = patientDemo;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait calculer l\'âge correctement', () => {
    const age = component.age;
    expect(age).toBeGreaterThan(0);
    expect(age).toBeLessThan(150);
  });

  it('devrait retourner les initiales correctes', () => {
    expect(component.initiales).toBe('JD');
  });

  it('devrait émettre patientSelected au clic', () => {
    spyOn(component.patientSelected, 'emit');
    component.selectionner();
    expect(component.patientSelected.emit).toHaveBeenCalledWith(patientDemo);
  });

  it('devrait ouvrir la modale d\'urgence', () => {
    const event = new MouseEvent('click');
    component.ouvrirModalUrgence(event);
    expect(component.showUrgenceModal).toBeTrue();
  });

  it('devrait émettre urgenceSignalee avec le motif', () => {
    spyOn(component.urgenceSignalee, 'emit');
    component.showUrgenceModal = true;
    component.motifUrgence = 'Détresse respiratoire';
    component.confirmerUrgence();
    expect(component.urgenceSignalee.emit).toHaveBeenCalledWith({
      patient: patientDemo,
      motif: 'Détresse respiratoire',
    });
  });
});
