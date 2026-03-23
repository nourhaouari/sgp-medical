// src/app/features/tableau-bord/tableau-bord.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patient } from '../patients/models/patient.model';
import { PatientService } from '../patients/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuditService } from '../../core/services/audit.service';

@Component({
  selector: 'app-tableau-bord',
  templateUrl: './tableau-bord.component.html',
  styleUrls: ['./tableau-bord.component.scss'],
})
export class TableauBordComponent implements OnInit, OnDestroy {
  statistiques: any = {};
  patientsUrgents: Patient[] = [];
  nomUtilisateur = '';
  dateActuelle = new Date();
  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private auditService: AuditService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUtilisateurConnecte();
    this.nomUtilisateur = user ? `${user.prenom} ${user.nom}` : 'Utilisateur';

    this.patientService.statistiques$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => this.statistiques = stats);

    this.patientService.patientsUrgents$
      .pipe(takeUntil(this.destroy$))
      .subscribe(urgents => this.patientsUrgents = urgents);
  }

  ouvrirDossier(patient: Patient): void {
    this.auditService.log('CONSULTATION_DOSSIER', patient.id, 'Accès depuis tableau de bord');
    this.router.navigate(['/patients', patient.id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
