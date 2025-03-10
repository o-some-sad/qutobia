import {AbstractControl, FormArray, ValidationErrors, ValidatorFn} from '@angular/forms';

export const atLeastOneAuthorValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const authorsArray = control as FormArray;
  return authorsArray.length > 0 ? null : { atLeastOneAuthor: true };
};
