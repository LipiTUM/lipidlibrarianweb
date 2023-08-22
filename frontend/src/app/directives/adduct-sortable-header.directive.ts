import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { Adduct } from 'src/app/models/adduct.model';


export type SortColumn = keyof Adduct | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
    selector: 'th[adductSortableAttribute]',
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'rotate()',
    },
    standalone: true,
})
export class AdductSortableHeaderDirective {
  @Input() adductSortableAttribute: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.adductSortableAttribute, direction: this.direction });
  }
}
