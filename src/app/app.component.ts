// src/app/app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { NotificationService, Notification } from './core/services/notification.service';
import { Utilisateur } from './shared/models/utilisateur.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  titre = 'SGP Medical';
  utilisateur: Utilisateur | null = null;
  notifications: Notification[] = [];
  menuOuvert = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.utilisateur$
      .pipe(takeUntil(this.destroy$))
      .subscribe(u => this.utilisateur = u);

    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(n => this.notifications = n);
  }

  fermerNotification(id: string): void {
    this.notificationService.supprimer(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
