import { Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { Lipid } from 'src/app/models/lipid.model';
import { Adduct } from 'src/app/models/adduct.model';
import { AdductTableService } from 'src/app/services/adduct-table.service';
import { AdductSortableHeaderDirective, SortEvent } from 'src/app/directives/adduct-sortable-header.directive';


@Component({
  selector: 'app-adduct-table',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    FormsModule,
    NgbHighlight,
    NgbPaginationModule,
    AdductSortableHeaderDirective,
  ],
  templateUrl: './adduct-table.component.html',
  styleUrls: ['./adduct-table.component.sass'],
})
export class AdductTableComponent implements OnChanges {
  @Input() lipid$?: Observable<Lipid | undefined>;
  adducts$!: Observable<Adduct[]>;
  total$: Observable<number>;

  @ViewChildren(AdductSortableHeaderDirective) headers!: QueryList<AdductSortableHeaderDirective>;

  constructor(public service: AdductTableService) {
    this.adducts$ = service.adducts$;
    this.total$ = service.total$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid) {
        let display_adducts: Array<Adduct> = [];
        for (let adduct of lipid.adducts) {
          for (let mass of adduct.masses) {
            let display_adduct = new Adduct(adduct);
            display_adduct.mass = mass.value;
            display_adduct.source = mass.sources.map( source => {source.source}).join(', ');
            display_adducts.push(display_adduct);
          }
        }
        this.service.adducts = display_adducts;
      } else {
        this.service.adducts = [];
      }
      this.service.force_update();
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.adductSortableAttribute !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
