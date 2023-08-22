import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { DatabaseIdentifier } from 'src/app/models/database-identifier.model';


export type SortColumn = keyof DatabaseIdentifier | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
    selector: 'th[databaseIdentifierSortableAttribute]',
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'rotate()',
    },
    standalone: true,
})
export class DatabaseIdentifierSortableHeaderDirective {
  @Input() databaseIdentifierSortableAttribute: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.databaseIdentifierSortableAttribute, direction: this.direction });
  }
}
