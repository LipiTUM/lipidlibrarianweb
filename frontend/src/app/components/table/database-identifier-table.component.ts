import { Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { Lipid } from 'src/app/models/lipid.model';
import { DatabaseIdentifier } from 'src/app/models/database-identifier.model';
import { DatabaseIdentifierTableService } from 'src/app/services/database-identifier-table.service';
import { DatabaseIdentifierSortableHeaderDirective, SortEvent } from 'src/app/directives/database-identifier-sortable-header.directive';


@Component({
  selector: 'app-database-identifier-table',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    FormsModule,
    NgbHighlight,
    NgbPaginationModule,
    DatabaseIdentifierSortableHeaderDirective,
  ],
  templateUrl: './database-identifier-table.component.html',
  styleUrls: ['./database-identifier-table.component.sass'],
})
export class DatabaseIdentifierTableComponent implements OnChanges {
  @Input() lipid$?: Observable<Lipid | undefined>;
  databaseIdentifiers$!: Observable<DatabaseIdentifier[]>;
  total$: Observable<number>;

  @ViewChildren(DatabaseIdentifierSortableHeaderDirective) headers!: QueryList<DatabaseIdentifierSortableHeaderDirective>;

  constructor(public service: DatabaseIdentifierTableService) {
    this.databaseIdentifiers$ = service.databaseIdentifiers$;
    this.total$ = service.total$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid) {
        this.service.databaseIdentifiers = lipid.database_identifiers;
      } else {
        this.service.databaseIdentifiers = [];
      }
      this.service.force_update();
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.databaseIdentifierSortableAttribute !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
