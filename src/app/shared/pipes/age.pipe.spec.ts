// src/app/shared/pipes/age.pipe.spec.ts
import { AgePipe } from './age.pipe';

describe('AgePipe', () => {
  const pipe = new AgePipe();

  it('devrait être créé', () => {
    expect(pipe).toBeTruthy();
  });

  it('devrait calculer l\'âge pour une date passée', () => {
    const dateNaissance = new Date();
    dateNaissance.setFullYear(dateNaissance.getFullYear() - 30);
    expect(pipe.transform(dateNaissance)).toBe(30);
  });

  it('devrait retourner 0 pour null', () => {
    expect(pipe.transform(null)).toBe(0);
  });

  it('devrait accepter une chaîne de caractères', () => {
    const age = pipe.transform('1990-01-01');
    expect(age).toBeGreaterThan(0);
  });
});
