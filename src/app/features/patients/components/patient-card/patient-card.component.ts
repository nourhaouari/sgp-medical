// src/app/features/patients/components/patient-card/patient-card.component.ts
import {
  Component, Input, Output, EventEmitter,
  OnInit, OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-card',
  templateUrl: './patient-card.component.html',
  styleUrls: ['./patient-card.component.scss'],
})
export class PatientCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) patient!: Patient;
  @Input() showSensitiveData = false;
  @Output() patientSelected = new EventEmitter<Patient>();
  @Output() urgenceSignalee = new EventEmitter<{ patient: Patient; motif: string }>();

  showUrgenceModal = false;
  motifUrgence = '';
  private destroy$ = new Subject<void>();

  get age(): number {
    const now = new Date();
    const birth = new Date(this.patient.dateNaissance);
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  get initiales(): string {
    return `${this.patient.prenom[0]}${this.patient.nom[0]}`.toUpperCase();
  }

  get couleurUrgence(): string {
    const map: Record<string, string> = {
      vert: '#27ae60', jaune: '#f39c12',
      orange: '#e67e22', rouge: '#e74c3c'
    };
    return map[this.patient.niveauUrgence ?? 'vert'] ?? '#95a5a6';
  }

  ngOnInit(): void {
    console.log('[PatientCard] Initialisée :', this.patient.ins);
  }

  selectionner(): void {
    this.patientSelected.emit(this.patient);
  }

  ouvrirModalUrgence(event: Event): void {
    event.stopPropagation();
    this.showUrgenceModal = true;
  }

  fermerModal(): void {
    this.showUrgenceModal = false;
    this.motifUrgence = '';
  }

  confirmerUrgence(): void {
    if (this.motifUrgence.trim()) {
      this.urgenceSignalee.emit({ patient: this.patient, motif: this.motifUrgence });
      this.fermerModal();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
