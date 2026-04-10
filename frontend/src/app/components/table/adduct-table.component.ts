import { Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NgIf, NgFor, AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { Lipid } from 'src/app/models/lipid.model';
import { Adduct } from 'src/app/models/adduct.model';
import { AdductTableService } from 'src/app/services/adduct-table.service';
import { AdductSortableHeaderDirective, SortEvent } from 'src/app/directives/adduct-sortable-header.directive';


@Component({
    selector: 'app-adduct-table',
    providers: [AdductTableService, DecimalPipe],
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
    styleUrls: ['./adduct-table.component.sass']
})
export class AdductTableComponent implements OnChanges {
  @Input() lipid$?: Observable<Lipid | undefined>;
  adducts$!: Observable<Adduct[]>;
  total$: Observable<number>;
  private lipidSubscription?: Subscription;

  @ViewChildren(AdductSortableHeaderDirective) headers!: QueryList<AdductSortableHeaderDirective>;

  constructor(public service: AdductTableService) {
    this.adducts$ = service.adducts$;
    this.total$ = service.total$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lipidSubscription?.unsubscribe();
    this.lipidSubscription = this.lipid$!.subscribe(lipid => {
      if (lipid) {
        let display_adducts: Array<Adduct> = [];
        for (let adduct of lipid.adducts) {
          for (let mass of adduct.masses) {
            let display_adduct = new Adduct(adduct);
            display_adduct.mass = mass.value;
            display_adduct.sources = mass.sources;
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

  formatSourceName(source: string): string {
    const displayNames: Record<string, string> = {
      lipidlibrarian: 'Goslin | LipidLynxX',
      swisslipids: 'SwissLipids',
      lipidmaps: 'LIPID MAPS',
      lipid_maps: 'LIPID MAPS',
      'lipid maps': 'LIPID MAPS',
      alex123: 'ALEX¹²³',
      linex: 'LINEX',
      lionweb: 'LION/web',
      lion_web: 'LION/web',
      'lion/web': 'LION/web',
      lion: 'LION/web',
      chebi: 'ChEBI',
      metanetx: 'MetaNetX',
      hmdb: 'HMDB',
      pubchem: 'PubChem',
      kegg: 'KEGG',
      goslin: 'Goslin',
    };
    return displayNames[source.toLowerCase()] ?? source;
  }
}
