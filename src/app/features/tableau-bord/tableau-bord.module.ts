// src/app/features/tableau-bord/tableau-bord.module.ts
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TableauBordComponent } from './tableau-bord.component';

@NgModule({
  declarations: [TableauBordComponent],
  imports: [SharedModule],
  exports: [TableauBordComponent],
})
export class TableauBordModule {}
