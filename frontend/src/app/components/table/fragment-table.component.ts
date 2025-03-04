import { Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { Lipid } from 'src/app/models/lipid.model';
import { Adduct } from 'src/app/models/adduct.model';
import { Fragment } from 'src/app/models/fragment.model';
import { FragmentTableService } from 'src/app/services/fragment-table.service';
import { FragmentSortableHeaderDirective, SortEvent } from 'src/app/directives/fragment-sortable-header.directive';


@Component({
    selector: 'app-fragment-table',
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        FormsModule,
        NgbHighlight,
        NgbPaginationModule,
        FragmentSortableHeaderDirective,
    ],
    templateUrl: './fragment-table.component.html',
    styleUrls: ['./fragment-table.component.sass']
})
export class FragmentTableComponent implements OnChanges {
  @Input() lipid$?: Observable<Lipid | undefined>;
  fragments$!: Observable<Fragment[]>;
  total$: Observable<number>;

  @ViewChildren(FragmentSortableHeaderDirective) headers!: QueryList<FragmentSortableHeaderDirective>;

  constructor(public service: FragmentTableService) {
    this.fragments$ = service.fragments$;
    this.total$ = service.total$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipid$!.subscribe(lipid => {
      if (lipid) {
        let display_fragments: Array<Fragment> = [];
        for (let adduct of lipid.adducts) {
          for (let fragment of adduct.fragments) {
            for (let mass of fragment.masses) {
              let display_fragment = new Fragment(fragment);
              display_fragment.adduct_name = adduct.name;
              display_fragment.mass = mass.value;
              display_fragment.source = mass.sources.map( source => {source.source}).join(', ');
              display_fragments.push(display_fragment);
            }
          }
        }
        this.service.fragments = display_fragments;
      } else {
        this.service.fragments = [];
      }
      this.service.force_update();
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.fragmentSortableAttribute !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
