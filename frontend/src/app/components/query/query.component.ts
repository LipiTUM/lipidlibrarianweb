import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { Observable, catchError, combineLatest, map, of, switchMap, takeWhile, timer } from 'rxjs';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Query } from 'src/app/models/query.model';
import { QueryService } from 'src/app/services/query.service';


@Component({
    selector: 'app-query',
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        RouterLink,
        NgbProgressbarModule
    ],
    templateUrl: './query.component.html',
    styleUrls: ['./query.component.sass']
})
export class QueryComponent implements OnInit {
  query$?: Observable<Query | undefined>;
  reloadEvents$: EventEmitter<any> = new EventEmitter();
  errorObject?: any;

  constructor(
    private route: ActivatedRoute,
    private queryService: QueryService
  ) { }

  ngOnInit() {
    this.reloadEvents$.subscribe(() => {});
    combineLatest([this.route.paramMap, this.reloadEvents$]).subscribe(
      ([params, reloadEvent]) => {
        this.query$ = timer(0, 5000).pipe(
          switchMap(() => {
            this.errorObject = undefined;
            return this.queryService.getQuery(params.get('query_id')!)
          }),
          map((query_data: any) => new Query(query_data)),
          takeWhile((query: Query) => query.status !== 'done', true),
          catchError((err: any) => {
            this.errorObject = err;
            return of(undefined);
          })
        );
      }
    );
    this.reloadEvents$.emit();
  }
}
