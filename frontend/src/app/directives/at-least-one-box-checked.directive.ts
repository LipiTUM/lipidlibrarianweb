import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Checkbox } from "../models/checkbox.model";


export function noBoxesCheckedValidator(control: AbstractControl): { [key: string]: boolean } | null {
  let checkedList:Array<Checkbox> = control.value;
  let trueValues = 0;
  for(let i= 0; i < checkedList.length; i++){
    if(checkedList[i] instanceof Object) {
      if(checkedList[i].isSelected) {
        trueValues++;
      }
    }
  }
  if (trueValues < 1) {
    return {'noBoxesChecked': true };
  }
  return null;
}

@Directive({
  selector: '[atLeastOneBoxChecked]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: AtLeastOneBoxCheckedDirective, multi: true}
  ],
  standalone: true
})
export class AtLeastOneBoxCheckedDirective {

}
