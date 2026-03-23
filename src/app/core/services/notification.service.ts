// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type TypeNotification = 'success' | 'error' | 'warning' | 'info' | 'urgence';

export interface Notification {
  id: string;
  type: TypeNotification;
  message: string;
  duree?: number; // ms, undefined = persistante
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();

  private ajouter(type: TypeNotification, message: string, duree?: number): void {
    const notif: Notification = {
      id: crypto.randomUUID(),
      type,
      message,
      duree
    };

    const actuelles = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...actuelles, notif]);

    if (duree) {
      setTimeout(() => this.supprimer(notif.id), duree);
    }
  }

  success(message: string): void {
    this.ajouter('success', message, 4000);
  }

  error(message: string): void {
    this.ajouter('error', message, 6000);
  }

  warning(message: string): void {
    this.ajouter('warning', message, 5000);
  }

  info(message: string): void {
    this.ajouter('info', message, 4000);
  }

  urgence(message: string): void {
    // Les alertes d'urgence sont persistantes (pas de durée)
    this.ajouter('urgence', `🚨 URGENCE : ${message}`);
  }

  supprimer(id: string): void {
    const actuelles = this.notificationsSubject.getValue();
    this.notificationsSubject.next(actuelles.filter(n => n.id !== id));
  }

  toutEffacer(): void {
    this.notificationsSubject.next([]);
  }
}
