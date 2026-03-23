// src/app/shared/pipes/ins-format.pipe.spec.ts
import { InsFormatPipe } from './ins-format.pipe';

describe('InsFormatPipe', () => {
  const pipe = new InsFormatPipe();

  it('devrait être créé', () => {
    expect(pipe).toBeTruthy();
  });

  it('devrait formater un INS de 13 chiffres', () => {
    const result = pipe.transform('1850612075047');
    expect(result).toBe('1 85 06 12 075 047');
  });

  it('devrait masquer l\'INS quand masquer=true', () => {
    const result = pipe.transform('1850612075047', true);
    expect(result).toBe('* ** ** ** *** *** **');
  });

  it('devrait retourner la valeur brute si trop courte', () => {
    expect(pipe.transform('123')).toBe('123');
  });
});
