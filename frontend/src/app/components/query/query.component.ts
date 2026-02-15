import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink, ParamMap } from '@angular/router';
import { Observable, catchError, tap, map, of, switchMap } from 'rxjs';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Query } from 'src/app/models/query.model';
import { BulkQuery } from 'src/app/models/bulk-query.model';
import { QueryService } from 'src/app/services/query.service';
import { QueryCardComponent } from 'src/app/components/query-card/query-card.component'


type QueryOrBulk = Query | BulkQuery;

@Component({
    selector: 'app-query',
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        RouterLink,
        NgbProgressbarModule,
        QueryCardComponent,
    ],
    templateUrl: './query.component.html',
    styleUrls: ['./query.component.sass']
})
export class QueryComponent implements OnInit {
  queries$!: Observable<Query[]> | undefined;
  errorObject?: any;


  constructor(
    private route: ActivatedRoute,
    private queryService: QueryService
  ) { }

  ngOnInit() {
    this.queries$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.queryService.getQueryOrBulkQuery(params.get('query_id')!)
      ),
      map(result => {
        if (!result) {
          throw new Error('Empty response from backend');
        }
        return this.normalize(result as QueryOrBulk);
      }),
      tap({
        error: err => console.log('PIPE ERROR:', err)
      }),
      catchError(err => {
        this.errorObject = err;
        return of([]);
      })
    );
  }

  private normalize(result: QueryOrBulk): Query[] {
    if (result.type === 'bulk') {
      return (result as BulkQuery).items.map((item: any) => new Query(item));
    } else {
      return [(result as Query)];
    }
  }

  trackByQueryId(_: number, query: Query) {
    return query.id;
  }
}
