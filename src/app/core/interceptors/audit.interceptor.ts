// src/app/core/interceptors/audit.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const debut = Date.now();

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const duree = Date.now() - debut;
            // Log automatique des appels API médicaux (hors audit lui-même)
            if (!req.url.includes('/api/audit')) {
              console.log(`[API] ${req.method} ${req.url} → ${event.status} (${duree}ms)`);
            }
          }
        },
        error: (err) => {
          console.error(`[API ERROR] ${req.method} ${req.url} → ${err.status}`);
        }
      })
    );
  }
}
