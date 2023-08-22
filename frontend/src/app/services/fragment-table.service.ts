import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

import { SortColumn, SortDirection } from 'src/app/directives/fragment-sortable-header.directive';
import { Fragment } from 'src/app/models/fragment.model';
import { Mass } from 'src/app/models/mass.model';
import { Source } from 'src/app/models/source.model';


interface SearchResult {
  fragments: Array<Fragment>;
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

function sort(fragments: Fragment[], column: SortColumn, direction: string): Fragment[] {
  if (direction === '' || column === '') {
    return fragments;
  } else {
    return [...fragments].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(fragment: Fragment, term: string, pipe: PipeTransform) {
  return (
    fragment.mass?.toString().toLowerCase().includes(term.toLowerCase()) ||
    fragment.name?.toLowerCase().includes(term.toLowerCase()) ||
    fragment.sum_formula?.toLowerCase().includes(term.toLowerCase()) ||
    fragment.source?.toLowerCase().includes(term.toLowerCase())
  );
}

@Injectable({ providedIn: 'root' })
export class FragmentTableService {
  public fragments?: Fragment[];
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _fragments$ = new BehaviorSubject<Fragment[]>([]);
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
        this._fragments$.next(result.fragments);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get fragments$() {
    return this._fragments$.asObservable();
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

    let fragments: Fragment[] = [];

    if (this.fragments) {
      fragments = this.fragments;
    }

    // 1. sort
    fragments = sort(fragments, sortColumn, sortDirection);

    // 2. filter
    fragments = fragments.filter((fragment) => matches(fragment, searchTerm, this.pipe));
    const total = fragments.length;

    // 3. paginate
    fragments = fragments.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    const result: SearchResult = { fragments, total };
    return of(result);
  }
}
