// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuditService } from '../services/audit.service';

// Contrôle d'Accès Basé sur les Rôles (RBAC)
export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const audit = inject(AuditService);

  const rolesRequis: string[] = route.data?.['rolesRequis'] ?? [];
  const roleUtilisateur = auth.getRole();

  if (rolesRequis.length === 0 || rolesRequis.includes(roleUtilisateur)) {
    return true;
  }

  // Accès refusé - journaliser la tentative
  audit.log(
    'ACCES_REFUSE',
    undefined,
    `Route: ${state.url}, Role: ${roleUtilisateur}, Requis: ${rolesRequis.join(',')}`
  );

  return router.createUrlTree(['/acces-refuse']);
};

// CanDeactivate - Protéger les formulaires non sauvegardés
import { CanDeactivateFn } from '@angular/router';

export interface FormulaireSauvegardable {
  aDesModificationsNonSauvegardees(): boolean;
}

export const formulaireNonSauvegardeGuard: CanDeactivateFn<FormulaireSauvegardable> =
  (component) => {
    if (component.aDesModificationsNonSauvegardees()) {
      return confirm(
        'Des modifications non sauvegardées seront perdues.\nContinuer quand même ?'
      );
    }
    return true;
  };
