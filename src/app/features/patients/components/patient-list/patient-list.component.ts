// src/app/features/patients/components/patient-list/patient-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { AuditService } from '../../../../core/services/audit.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];
  statistiques: any = {};
  recherche = '';
  filtreStatut = '';
  filtreUrgence = '';
  afficherDonneesSensibles = false;
  enChargement = false;

  private destroy$ = new Subject<void>();
  private rechercheSubject = new BehaviorSubject<string>('');

  constructor(
    private patientService: PatientService,
    private auditService: AuditService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  get estMedecin(): boolean {
    return this.authService.getRole() === 'medecin';
  }

  ngOnInit(): void {
    // Charger la liste des patients
    this.patientService.patients$
      .pipe(takeUntil(this.destroy$))
      .subscribe(patients => {
        this.appliquerFiltres(patients);
      });

    // Statistiques du tableau de bord
    this.patientService.statistiques$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => this.statistiques = stats);

    // Recherche avec debounce
    this.rechercheSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(terme => this.patientService.rechercherPatients(terme)),
      takeUntil(this.destroy$)
    ).subscribe(resultats => this.patients = this.filtrerResultats(resultats));
  }

  onRecherche(event: Event): void {
    this.recherche = (event.target as HTMLInputElement).value;
    this.rechercheSubject.next(this.recherche);
  }

  reinitialiserRecherche(): void {
    this.recherche = '';
    this.rechercheSubject.next('');
  }

  private appliquerFiltres(patients: Patient[]): void {
    this.patients = this.filtrerResultats(patients);
  }

  private filtrerResultats(patients: Patient[]): Patient[] {
    return patients.filter(p => {
      if (this.filtreStatut && p.statut !== this.filtreStatut) return false;
      if (this.filtreUrgence && p.niveauUrgence !== this.filtreUrgence) return false;
      return true;
    });
  }

  onPatientSelectionne(patient: Patient): void {
    this.auditService.log('CONSULTATION_DOSSIER', patient.id);
    this.patientService.definirPatientCourant(patient);
    this.router.navigate(['/patients', patient.id]);
  }

  onUrgence(data: { patient: Patient; motif: string }): void {
    this.patientService.modifierNiveauUrgence(data.patient.id, 'rouge');
    this.auditService.log('URGENCE', data.patient.id, data.motif);
    this.notificationService.urgence(
      `${data.patient.prenom} ${data.patient.nom} — ${data.motif}`
    );
  }

  toggleDonneesSensibles(): void {
    this.afficherDonneesSensibles = !this.afficherDonneesSensibles;
    if (this.afficherDonneesSensibles) {
      this.auditService.log('VIEW_SENSITIVE', undefined, 'Affichage données sensibles — liste patients');
    }
  }

  trackByPatientId(index: number, patient: Patient): string {
    return patient.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
