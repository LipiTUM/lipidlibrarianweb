import { Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { Lipid } from 'src/app/models/lipid.model';
import { StructureIdentifier } from 'src/app/models/structure-identifier.model';
import { StructureIdentifierTableService } from 'src/app/services/structure-identifier-table.service';
import { StructureIdentifierSortableHeaderDirective, SortEvent } from 'src/app/directives/structure-identifier-sortable-header.directive';


@Component({
    selector: 'app-structure-identifier-table',
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        FormsModule,
        NgbHighlight,
        NgbPaginationModule,
        StructureIdentifierSortableHeaderDirective,
    ],
    templateUrl: './structure-identifier-table.component.html',
    styleUrls: ['./structure-identifier-table.component.sass']
})
export class StructureIdentifierTableComponent implements OnChanges {
  @Input() lipid$?: Observable<Lipid | undefined>;
  structureIdentifiers$!: Observable<StructureIdentifier[]>;
  total$: Observable<number>;

  @ViewChildren(StructureIdentifierSortableHeaderDirective) headers!: QueryList<StructureIdentifierSortableHeaderDirective>;

  constructor(public service: StructureIdentifierTableService) {
    this.structureIdentifiers$ = service.structureIdentifiers$;
    this.total$ = service.total$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid) {
        this.service.structureIdentifiers = lipid.nomenclature.structure_identifiers;
      } else {
        this.service.structureIdentifiers = [];
      }
      this.service.force_update();
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.structureIdentifierSortableAttribute !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
