// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableauBordComponent } from './features/tableau-bord/tableau-bord.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // Redirection racine
  { path: '', redirectTo: '/tableau-de-bord', pathMatch: 'full' },

  // Tableau de bord (chargement eager pour accès immédiat)
  {
    path: 'tableau-de-bord',
    component: TableauBordComponent,
    canActivate: [authGuard]
  },

  // Module Patients (lazy loading)
  {
    path: 'patients',
    loadChildren: () =>
      import('./features/patients/patients.module').then(m => m.PatientsModule),
    canActivate: [authGuard]
  },

  // Route inconnue — wildcard
  { path: '**', redirectTo: '/tableau-de-bord' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
