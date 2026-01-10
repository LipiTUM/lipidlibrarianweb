import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function maxLinesValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const lines = control.value
      .split(/\r?\n/)
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0);

    return lines.length > max
      ? { maxItems: { max, actual: lines.length } }
      : null;
  };
}
