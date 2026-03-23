// src/app/features/patients/patients.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientCardComponent } from './components/patient-card/patient-card.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { formulaireNonSauvegardeGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: PatientListComponent },
  { path: 'nouveau', component: PatientFormComponent },
  { path: ':id', component: PatientDetailComponent },
  {
    path: ':id/modifier',
    component: PatientFormComponent,
    canDeactivate: [formulaireNonSauvegardeGuard]
  },
];

@NgModule({
  declarations: [
    PatientListComponent,
    PatientCardComponent,
    PatientDetailComponent,
    PatientFormComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PatientsModule {}
