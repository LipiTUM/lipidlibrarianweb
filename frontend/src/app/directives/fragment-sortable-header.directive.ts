import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { Fragment } from 'src/app/models/fragment.model';


export type SortColumn = keyof Fragment | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
    selector: 'th[fragmentSortableAttribute]',
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'rotate()',
    },
    standalone: true,
})
export class FragmentSortableHeaderDirective {
  @Input() fragmentSortableAttribute: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.fragmentSortableAttribute, direction: this.direction });
  }
}
