import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, catchError, first, map, of, switchMap, timer } from 'rxjs';

import { Query } from 'src/app/models/query.model';
import { QueryService } from 'src/app/services/query.service';
import { HistoryService } from 'src/app/services/history.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TokenComponent } from '../token/token.component';
import { NgbActiveOffcanvas, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    RouterLink,
    NgbTooltipModule,
    NgbCollapseModule,
    TokenComponent
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass'],
})
export class HistoryComponent implements OnInit {
  queries$?: Observable<Array<Query> | undefined>;
  reloadEvents$: EventEmitter<any> = new EventEmitter();
  errorObject?: any;
  loading: boolean = true;

  constructor(
    public activeOffcanvas: NgbActiveOffcanvas,
    public historyService: HistoryService,
    private queryService: QueryService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.reloadEvents$.subscribe(() => {
      this.queries$ = timer(0, 10000).pipe(
        switchMap(() => {
          this.loading = true;
          this.errorObject = undefined;
          return this.queryService.getQueries()
        }),
        map((queries_data: any) => {
          let queries: Array<Query> = [];
          for (let query_data of queries_data) {
            queries.push(new Query(query_data));
          }
          this.loading = false;
          return queries;
        }),
        catchError((err: any) => {
          this.errorObject = err;
          this.notificationService.show("Loading your history failed, the backend server may be offline. Please try again later.", { header: "Connection Error", classname: 'bg-danger text-light', delay: 15000 });
          return of(undefined);
        })
      );
    });
    this.reloadEvents$.emit();
  }

  deleteQuery(query_id: string): void {
    this.queries$?.pipe(first()).subscribe({
      next: (queries: any) => {
        let query_string: string = "";
        for (let i = 0; i < queries.length; i++) {
          if (queries[i].id === query_id) {
            query_string = queries[i].query_string;
          }
        }
        this.queryService.deleteQuery(query_id).subscribe({
          next: (data: any) => {
            this.notificationService.show("History Item '" + query_string + "' deleted.", { header: "Deletion Successful", classname: 'bg-success text-light' });
            this.reloadEvents$.emit();
          },
          error: (data: any) => {
            this.notificationService.show("History Item '" + query_string + "' could not be deleted, the backend server may be offline. Please refresh the page and try again later.", { header: "Connection Error", classname: 'bg-danger text-light', delay: 15000 });
          }
        });
      }
    });
  }

  navigateToLipid(query_id: string): void {
    this.historyService.updateCollapsed(query_id);
    this.activeOffcanvas.dismiss('Navigation');
  }
}
