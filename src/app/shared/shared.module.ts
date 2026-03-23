// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Pipes
import { AgePipe } from './pipes/age.pipe';
import { InsFormatPipe } from './pipes/ins-format.pipe';
import { Cim10Pipe } from './pipes/cim10.pipe';

// Directives
import { SensitiveDataDirective } from './directives/sensitive-data.directive';
import { RoleVisibilityDirective } from './directives/role-visibility.directive';

const DECLARATIONS = [
  AgePipe,
  InsFormatPipe,
  Cim10Pipe,
  SensitiveDataDirective,
  RoleVisibilityDirective,
];

@NgModule({
  declarations: DECLARATIONS,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [
    ...DECLARATIONS,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class SharedModule {}
