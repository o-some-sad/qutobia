import {ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';

export const addressPhoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const address = control.value.address;
  const phone = control.value.phone;
  return ((address && !phone) || (!address && phone)) ? { addressPhoneMismatch: true } : null;
};

export const phoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const phone = control.value.phone;
  const phoneRegex = /^\+201[0|1|2|5][0-9]{8}$/;
  return phone && !phoneRegex.test(phone) ? { invalidPhone: true } : null;
};
