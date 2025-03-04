import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Checkbox } from "../../models/checkbox.model";
import { QueryFormComponent } from "../query-form/query-form.component";
import {Form, FormControl} from "@angular/forms";

/**
 *  https://www.itsolutionstuff.com/post/how-to-check-all-and-uncheck-all-checkboxes-in-angularexample.html
 */
@Component({
    selector: 'checkbox',
    imports: [
        NgFor,
        FormsModule,
        NgIf
    ],
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.sass']
})
export class CheckboxComponent {
  @Input() checkBoxValues: Array<Checkbox> = [];
  @Input() checkBoxTitle: string = "Checkbox Form Title";
  @Output() checkBoxFormEvent: EventEmitter<Array<Checkbox>> = new EventEmitter<Array<Checkbox>>();
  keepTrack(): void {
    this.checkBoxFormEvent.emit(this.checkBoxValues);
  }

  selectAll(): void {
    for (var i = 0; i < this.checkBoxValues.length; i++) {
      this.checkBoxValues[i].isSelected = true;
    }
    this.keepTrack();
  }

  unselectAll(): void {
    for (var i = 0; i < this.checkBoxValues.length; i++) {
      this.checkBoxValues[i].isSelected = false;
    }
    this.keepTrack();
  }
}
