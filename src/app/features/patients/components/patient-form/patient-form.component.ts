// src/app/features/patients/components/patient-form/patient-form.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, FormArray,
  Validators, AbstractControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuditService } from '../../../../core/services/audit.service';
import { FormulaireSauvegardable } from '../../../../core/guards/role.guard';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})
export class PatientFormComponent implements OnInit, FormulaireSauvegardable {
  patientForm!: FormGroup;
  modeEdition = false;
  patientId?: string;
  soumissionEnCours = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private notificationService: NotificationService,
    private auditService: AuditService
  ) {}

  get antecedents(): FormArray {
    return this.patientForm.get('antecedents') as FormArray;
  }

  get allergies(): FormArray {
    return this.patientForm.get('allergies') as FormArray;
  }

  aDesModificationsNonSauvegardees(): boolean {
    return this.patientForm.dirty && !this.soumissionEnCours;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const patientExistant = id ? this.patientService.getPatientById(id) : null;
    this.modeEdition = !!patientExistant;
    this.patientId = id ?? undefined;

    this.patientForm = this.fb.group({
      // Identité
      nom: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
      ]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: [null, [Validators.required, this.validateurDatePassee]],
      sexe: ['', Validators.required],
      ins: ['', [
        Validators.required,
        Validators.pattern(/^[12][0-9]{12}$/)
      ]],
      // Coordonnées
      telephone: ['', [
        Validators.required,
        Validators.pattern(/^0[1-9](\s?\d{2}){4}$/)
      ]],
      email: ['', [Validators.email]],
      // Adresse
      adresse: this.fb.group({
        ligne1: ['', Validators.required],
        ligne2: [''],
        codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        ville: ['', Validators.required],
        pays: ['France', Validators.required],
      }),
      // Médical
      groupeSanguin: [''],
      medecinTraitantId: ['DR001', Validators.required],
      statut: ['actif', Validators.required],
      niveauUrgence: ['vert'],
      antecedents: this.fb.array([]),
      allergies: this.fb.array([]),
      traitementEnCours: this.fb.array([]),
    });

    if (patientExistant) {
      // patchValue pour les champs simples
      this.patientForm.patchValue({
        ...patientExistant,
        dateNaissance: new Date(patientExistant.dateNaissance)
          .toISOString().split('T')[0]
      });
      // FormArrays
      patientExistant.antecedents.forEach(a => this.ajouterAntecedent(a));
      patientExistant.traitementEnCours.forEach(t => this.ajouterTraitement(t));
      patientExistant.allergies.forEach(a => this.ajouterAllergie(
        a.substance, a.reaction, a.severite
      ));
    }
  }

  ajouterAntecedent(valeur = ''): void {
    (this.patientForm.get('antecedents') as FormArray)
      .push(this.fb.control(valeur, Validators.required));
  }

  ajouterTraitement(valeur = ''): void {
    (this.patientForm.get('traitementEnCours') as FormArray)
      .push(this.fb.control(valeur, Validators.required));
  }

  get traitements(): FormArray {
    return this.patientForm.get('traitementEnCours') as FormArray;
  }

  ajouterAllergie(substance = '', reaction = '', severite = 'moderee'): void {
    this.allergies.push(this.fb.group({
      substance: [substance, Validators.required],
      reaction: [reaction, Validators.required],
      severite: [severite, Validators.required],
      dateDeclaration: [new Date(), Validators.required],
    }));
  }

  validateurDatePassee(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    return new Date(ctrl.value) < new Date() ? null : { dateAvenir: true };
  }

  getErreur(champ: string): string | null {
    const ctrl = this.patientForm.get(champ);
    if (!ctrl?.invalid || !ctrl.touched) return null;
    if (ctrl.errors?.['required']) return 'Ce champ est obligatoire';
    if (ctrl.errors?.['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} caractères`;
    if (ctrl.errors?.['pattern']) return 'Format invalide';
    if (ctrl.errors?.['email']) return 'Adresse email invalide';
    if (ctrl.errors?.['dateAvenir']) return 'La date doit être dans le passé';
    return null;
  }

  onSoumettre(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      this.notificationService.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    this.soumissionEnCours = true;
    const valeurs = this.patientForm.value;

    if (this.modeEdition && this.patientId) {
      const existant = this.patientService.getPatientById(this.patientId)!;
      this.patientService.mettreAJourPatient({ ...existant, ...valeurs });
      this.auditService.log('MODIFICATION_PATIENT', this.patientId);
      this.notificationService.success('Patient modifié avec succès');
      this.router.navigate(['/patients', this.patientId]);
    } else {
      const nouveau = this.patientService.ajouterPatient(valeurs);
      this.notificationService.success('Patient créé avec succès');
      this.router.navigate(['/patients', nouveau.id]);
    }
  }

  annuler(): void {
    if (this.modeEdition && this.patientId) {
      this.router.navigate(['/patients', this.patientId]);
    } else {
      this.router.navigate(['/patients']);
    }
  }
}
