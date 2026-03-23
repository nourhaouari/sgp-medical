// src/app/shared/directives/role-visibility.directive.ts
import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { RoleUtilisateur } from '../models/utilisateur.model';
import { AuthService } from '../../core/services/auth.service';

@Directive({ selector: '[appRoleVisibility]' })
export class RoleVisibilityDirective implements OnInit {
  @Input() appRoleVisibility: RoleUtilisateur[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const roleActuel = this.authService.getRole();
    if (this.appRoleVisibility.includes(roleActuel)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
