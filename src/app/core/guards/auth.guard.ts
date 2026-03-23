// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estAuthentifie()) {
    return true;
  }

  // Rediriger vers la connexion en conservant l'URL demandée
  return router.createUrlTree(['/connexion'], {
    queryParams: { returnUrl: state.url }
  });
};
