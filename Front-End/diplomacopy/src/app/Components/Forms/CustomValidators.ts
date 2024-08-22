import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static polishAlphabet(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*$/.test(control.value);
      return isValid ? null : { 'polishAlphabet': { value: control.value } };
    };
  }

  static onlySpaceAndHyphen(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = /^[ -]*$/.test(control.value);
      return isValid ? null : { 'onlySpaceHyphenQuestionMark': { value: control.value } };
    };
  }
}