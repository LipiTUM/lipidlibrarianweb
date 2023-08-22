import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { Synonym } from 'src/app/models/synonym.model';


export type SortColumn = keyof Synonym | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
    selector: 'th[synonymSortableAttribute]',
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'rotate()',
    },
    standalone: true,
})
export class SynonymSortableHeaderDirective {
  @Input() synonymSortableAttribute: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.synonymSortableAttribute, direction: this.direction });
  }
}
