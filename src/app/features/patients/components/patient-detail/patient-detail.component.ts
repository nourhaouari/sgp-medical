// src/app/features/patients/components/patient-detail/patient-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { AuditService } from '../../../../core/services/audit.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  patient?: Patient;
  ongletActif = 'resume';
  estMedecin = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private auditService: AuditService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  get imc(): number | null {
    const c = this.patient?.dernieresConstantes;
    if (!c?.poids || !c?.taille) return null;
    return c.poids / Math.pow(c.taille / 100, 2);
  }

  get labelIMC(): string {
    const v = this.imc;
    if (v === null) return 'N/A';
    if (v < 18.5) return 'Insuffisance pondérale';
    if (v < 25) return 'Poids normal';
    if (v < 30) return 'Surpoids';
    return 'Obésité';
  }

  ngOnInit(): void {
    this.estMedecin = this.authService.getRole() === 'medecin';

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id') ?? '';
      this.patient = this.patientService.getPatientById(id);
      if (!this.patient) {
        this.notificationService.error('Patient introuvable');
        this.router.navigate(['/patients']);
        return;
      }
      // Journalisation obligatoire — chaque consultation de dossier
      this.auditService.log('CONSULTATION_DOSSIER', id);
      this.patientService.definirPatientCourant(this.patient);
    });

    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(q => {
      this.ongletActif = q.get('onglet') ?? 'resume';
    });
  }

  changerOnglet(onglet: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { onglet },
      queryParamsHandling: 'merge'
    });
  }

  retourListe(): void {
    this.router.navigate(['/patients']);
  }

  ngOnDestroy(): void {
    this.patientService.definirPatientCourant(null);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
