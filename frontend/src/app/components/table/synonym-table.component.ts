import { Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { Lipid } from 'src/app/models/lipid.model';
import { Synonym } from 'src/app/models/synonym.model';
import { SynonymTableService } from 'src/app/services/synonym-table.service';
import { SynonymSortableHeaderDirective, SortEvent } from 'src/app/directives/synonym-sortable-header.directive';


@Component({
    selector: 'app-synonym-table',
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        FormsModule,
        NgbHighlight,
        NgbPaginationModule,
        SynonymSortableHeaderDirective,
    ],
    templateUrl: './synonym-table.component.html',
    styleUrls: ['./synonym-table.component.sass']
})
export class SynonymTableComponent implements OnChanges {
  @Input() lipid$?: Observable<Lipid | undefined>;
  synonyms$!: Observable<Synonym[]>;
  total$: Observable<number>;

  @ViewChildren(SynonymSortableHeaderDirective) headers!: QueryList<SynonymSortableHeaderDirective>;

  constructor(public service: SynonymTableService) {
    this.synonyms$ = service.synonyms$;
    this.total$ = service.total$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid) {
        this.service.synonyms = lipid.nomenclature.synonyms;
      } else {
        this.service.synonyms = [];
      }
      this.service.force_update();
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.synonymSortableAttribute !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
