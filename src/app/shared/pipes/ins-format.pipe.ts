// src/app/shared/pipes/ins-format.pipe.ts
// Formate l'INS : 1850612075047 -> 1 85 06 12 075 047 (clé)
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'insFormat' })
export class InsFormatPipe implements PipeTransform {
  transform(ins: string, masquer = false): string {
    if (masquer) return '* ** ** ** *** *** **';
    if (!ins || ins.length < 13) return ins;
    return `${ins[0]} ${ins.slice(1, 3)} ${ins.slice(3, 5)} ${ins.slice(5, 7)} ` +
      `${ins.slice(7, 10)} ${ins.slice(10, 13)}${ins.length > 13 ? ' ' + ins.slice(13) : ''}`;
  }
}
