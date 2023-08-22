import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

import { SortColumn, SortDirection } from 'src/app/directives/adduct-sortable-header.directive';
import { Adduct } from 'src/app/models/adduct.model';
import { Mass } from 'src/app/models/mass.model';
import { Source } from 'src/app/models/source.model';


interface SearchResult {
  adducts: Array<Adduct>;
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number | Source[] | Mass[] | undefined, v2: string | number | Source[] | Mass[] | undefined) => {
  if (v1 && v2) {
    if (typeof v1 === "object" && typeof v2 === "object") {
      if ("source" in v1 && "source" in v2) {
        const source1 = (<Source[]>v1)[0].source;
        const source2 = (<Source[]>v2)[0].source;
        return source1 < source2 ? -1 : source1 > source2 ? 1 : 0;
      }
      if ("value" in v1 && "value" in v2) {
        const mass1 = (<Mass[]>v1)[0].value ?? 0;
        const mass2 = (<Mass[]>v2)[0].value ?? 0;
        return mass1 < mass2 ? -1 : mass1 > mass2 ? 1 : 0;
      }
    } else if (typeof v1 == typeof v2) {
      return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
    }
  }
  return 0;
};

function sort(adducts: Adduct[], column: SortColumn, direction: string): Adduct[] {
  if (direction === '' || column === '') {
    return adducts;
  } else {
    return [...adducts].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(adduct: Adduct, term: string, pipe: PipeTransform) {
  return (
    adduct.mass?.toString().toLowerCase().includes(term.toLowerCase()) ||
    adduct.name?.toLowerCase().includes(term.toLowerCase()) ||
    adduct.swisslipids_abbrev?.toLowerCase().includes(term.toLowerCase()) ||
    adduct.swisslipids_name?.toLowerCase().includes(term.toLowerCase()) ||
    adduct.lipidmaps_name?.toLowerCase().includes(term.toLowerCase()) ||
    adduct.source?.toLowerCase().includes(term.toLowerCase())
  );
}

@Injectable({ providedIn: 'root' })
export class AdductTableService {
  public adducts?: Adduct[];
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _adducts$ = new BehaviorSubject<Adduct[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(private pipe: DecimalPipe) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        tap(() => this._loading$.next(false)),
      )
      .subscribe((result) => {
        this._adducts$.next(result.adducts);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get adducts$() {
    return this._adducts$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  public force_update(): void {
    const state: State = {
      page: 1,
      pageSize: 5,
      searchTerm: '',
      sortColumn: '',
      sortDirection: '',
    };
    Object.assign(this._state, state);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    let adducts: Adduct[] = [];

    if (this.adducts) {
      adducts = this.adducts;
    }

    // 1. sort
    adducts = sort(adducts, sortColumn, sortDirection);

    // 2. filter
    adducts = adducts.filter((adduct) => matches(adduct, searchTerm, this.pipe));
    const total = adducts.length;

    // 3. paginate
    adducts = adducts.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    const result: SearchResult = { adducts, total };
    return of(result);
  }
}
