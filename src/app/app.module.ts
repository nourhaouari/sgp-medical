// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { TableauBordModule } from './features/tableau-bord/tableau-bord.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // Angular core
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Routing
    AppRoutingModule,

    // Application modules
    CoreModule,         // Services singleton, interceptors, guards
    SharedModule,       // Pipes, directives, composants partagés
    TableauBordModule,  // Tableau de bord (eager)
    // PatientsModule est chargé en lazy loading via AppRoutingModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
