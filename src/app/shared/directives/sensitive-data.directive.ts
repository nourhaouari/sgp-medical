// src/app/shared/directives/sensitive-data.directive.ts
import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AuditService } from '../../core/services/audit.service';

@Directive({ selector: '[appSensitiveData]' })
export class SensitiveDataDirective implements OnInit {
  @Input() appSensitiveData = true;  // true = masquer par défaut
  @Input() maskChar = '•';
  @Input() patientId?: string;

  private originalText = '';
  private isVisible = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    if (this.appSensitiveData && !this.authService.peutVoirDonneesSensibles()) {
      this.originalText = this.el.nativeElement.textContent ?? '';
      this.masquer();
    } else {
      this.originalText = this.el.nativeElement.textContent ?? '';
    }
  }

  @HostListener('click')
  toggleVisibilite(): void {
    if (!this.authService.peutVoirDonneesSensibles()) return;
    if (this.isVisible) {
      this.masquer();
    } else {
      this.afficher();
      if (this.patientId) {
        this.auditService.log('VIEW_SENSITIVE', this.patientId);
      }
    }
    this.isVisible = !this.isVisible;
  }

  private masquer(): void {
    const masked = this.maskChar.repeat(Math.min(this.originalText.length, 16));
    this.renderer.setProperty(this.el.nativeElement, 'textContent', masked);
    this.renderer.addClass(this.el.nativeElement, 'donnee-masquee');
    this.renderer.setAttribute(this.el.nativeElement, 'title', 'Cliquer pour révéler');
  }

  private afficher(): void {
    this.renderer.setProperty(this.el.nativeElement, 'textContent', this.originalText);
    this.renderer.removeClass(this.el.nativeElement, 'donnee-masquee');
    this.renderer.removeAttribute(this.el.nativeElement, 'title');
  }
}
