import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const integerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return Number.isInteger(+control.value) ? null : { integer: true };
};
export const positiveNumberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return +control.value >= 0 ? null : { positiveNumber: true };
};
