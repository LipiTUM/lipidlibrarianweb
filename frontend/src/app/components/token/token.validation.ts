import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export class TokenValidation {

  /*
  * Function Factory to validate the format of a UUID.
  */
  static uuidValidatorFactory(controlName: string): ValidatorFn{
    return (controls: AbstractControl): ValidationErrors | null => {
      const uuid_control = controls.get(controlName);

      if (uuid_control == null) {
        return null;
      }

      if (uuid_control.value === '') {
        return null;
      }

      let uuid_match = uuid_control.value.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
      if (uuid_control && uuid_match === null) {
        controls.get(controlName)?.setErrors({ notValidUUID: true });
        return { notValidUUID: true };
      } else {
        return null;
      }
    }
  }
}
