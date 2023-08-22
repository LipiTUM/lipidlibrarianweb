import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export class QueryFormValidation {
  /*
  * Function Factory to validate the amount of checkboxes checked
  * https://github.com/bezkoder/angular-14-form-validation
  */
  checkboxAmountValidatorFactory(controlName: string, min: number, max: number) : ValidatorFn {
    return (controls: AbstractControl): ValidationErrors | null => {
      // Get current amount
      let checkboxes = controls.get(controlName);
      let selected = 0;
      checkboxes?.getRawValue().forEach((e: any) => {
        if (e === true) {
          selected = selected + 1;
        }
      });

      // Return Validation
      if (selected < min) {
        return { minSelectionInvalid: true };
      }
      if (selected > max) {
        return  { maxSelectionInvalid: true };
      }
      return null;
    };
  }
}
