// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler,
  HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuditService } from '../services/audit.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private auditService: AuditService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const utilisateur = this.authService.getUtilisateurConnecte();

    // Injecter le token JWT dans toutes les requêtes API médicales
    const reqAvecToken = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'X-Utilisateur-Id': utilisateur?.id ?? '',
            'X-Request-Id': crypto.randomUUID(),
          }
        })
      : req;

    return next.handle(reqAvecToken).pipe(
      catchError((erreur: HttpErrorResponse) => {
        if (erreur.status === 401) {
          this.authService.deconnecter();
          this.router.navigate(['/connexion']);
        }
        if (erreur.status === 403) {
          this.auditService.log('ACCES_REFUSE', undefined, req.url);
          this.router.navigate(['/acces-refuse']);
        }
        return throwError(() => erreur);
      })
    );
  }
}
