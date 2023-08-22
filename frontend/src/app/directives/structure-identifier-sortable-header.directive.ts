import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { StructureIdentifier } from 'src/app/models/structure-identifier.model';


export type SortColumn = keyof StructureIdentifier | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
    selector: 'th[structureIdentifierSortableAttribute]',
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'rotate()',
    },
    standalone: true,
})
export class StructureIdentifierSortableHeaderDirective {
  @Input() structureIdentifierSortableAttribute: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.structureIdentifierSortableAttribute, direction: this.direction });
  }
}
