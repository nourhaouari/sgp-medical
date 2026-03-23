// src/app/shared/pipes/age.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'age', pure: true })
export class AgePipe implements PipeTransform {
  transform(dateNaissance: Date | string | null): number {
    if (!dateNaissance) return 0;
    const birth = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }
}
