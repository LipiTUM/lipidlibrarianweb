import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

import { SortColumn, SortDirection } from 'src/app/directives/structure-identifier-sortable-header.directive';
import { StructureIdentifier } from 'src/app/models/structure-identifier.model';
import { Source } from 'src/app/models/source.model';


interface SearchResult {
  structureIdentifiers: Array<StructureIdentifier>;
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | Source[] | undefined, v2: string | Source[] | undefined) => {
  if (v1 && v2) {
    if (typeof v1 === "object" && typeof v2 === "object") {
      if ("source" in v1 && "source" in v2) {
        const source1 = <Source[]>v1.source;
        const source2 = <Source[]>v2.source;
        return source1 < source2 ? -1 : source1 > source2 ? 1 : 0;
      }
    } else if (typeof v1 == typeof v2) {
      return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
    }
  }
  return 0;
};

function sort(structureIdentifiers: StructureIdentifier[], column: SortColumn, direction: string): StructureIdentifier[] {
  if (direction === '' || column === '') {
    return structureIdentifiers;
  } else {
    return [...structureIdentifiers].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(structureIdentifier: StructureIdentifier, term: string, pipe: PipeTransform) {
  return (
    structureIdentifier.value?.toLowerCase().includes(term.toLowerCase()) ||
    structureIdentifier.structure_type?.toLowerCase().includes(term.toLowerCase()) ||
    structureIdentifier.sources?.map(source => {source.source}).join(' ').includes(term.toLowerCase())
  );
}

@Injectable({ providedIn: 'root' })
export class StructureIdentifierTableService {
  public structureIdentifiers?: StructureIdentifier[];
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _structureIdentifiers$ = new BehaviorSubject<StructureIdentifier[]>([]);
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
        this._structureIdentifiers$.next(result.structureIdentifiers);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get structureIdentifiers$() {
    return this._structureIdentifiers$.asObservable();
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

    let structureIdentifiers: StructureIdentifier[] = [];

    if (this.structureIdentifiers) {
      structureIdentifiers = this.structureIdentifiers;
    }

    // 1. sort
    structureIdentifiers = sort(structureIdentifiers, sortColumn, sortDirection);

    // 2. filter
    structureIdentifiers = structureIdentifiers.filter((structureIdentifier) => matches(structureIdentifier, searchTerm, this.pipe));
    const total = structureIdentifiers.length;

    // 3. paginate
    structureIdentifiers = structureIdentifiers.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    const result: SearchResult = { structureIdentifiers, total };
    return of(result);
  }
}
