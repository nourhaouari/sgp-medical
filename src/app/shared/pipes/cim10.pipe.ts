// src/app/shared/pipes/cim10.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cim10' })
export class Cim10Pipe implements PipeTransform {
  private readonly codes: Record<string, string> = {
    'J44': 'Bronchopneumopathie chronique obstructive',
    'J45': 'Asthme',
    'I10': 'Hypertension artérielle essentielle',
    'I25': 'Cardiopathie ischémique chronique',
    'E11': 'Diabète de type 2',
    'E10': 'Diabète de type 1',
    'F32': 'Épisode dépressif',
    'F41': 'Anxiété généralisée',
    'G43': 'Migraine',
    'N18': 'Maladie rénale chronique',
    'K21': 'Reflux gastro-œsophagien',
    'M79': 'Fibromyalgie',
    'Z96': 'Présence d\'implants',
  };

  transform(code: string): string {
    return this.codes[code] ?? code;
  }
}
