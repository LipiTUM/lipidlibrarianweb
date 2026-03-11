import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { NgIf, NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, Subject, takeUntil, shareReplay, switchMap, takeWhile, timer, catchError, tap, map } from 'rxjs';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Query } from 'src/app/models/query.model';
import { QueryService } from 'src/app/services/query.service';
import { NotificationService } from 'src/app/services/notification.service';
import { QueryResultSource } from 'src/app/models/query-result-source.model';
import { Level, LevelLabel } from 'src/app/models/level.enum';


@Component({
    selector: 'app-query-card',
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        RouterLink,
        NgbProgressbarModule,
        CommonModule
    ],
    templateUrl: './query-card.component.html',
    styleUrls: ['./query-card.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryCardComponent {
  @Input() queryId!: string;
  @Output() singleResultReady = new EventEmitter<string>();

  query$!: Observable<Query | undefined>;
  errorObject?: any;
  emittedSingleResultReady: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private queryService: QueryService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.query$ = timer(0, 5000).pipe(
      switchMap(() => this.queryService.getQuery(this.queryId)),
      tap(q => console.debug('Query response:', q)),
      takeWhile(q => q.status === 'pending' || q.status === 'running', true),
      takeUntil(this.destroy$),
      shareReplay({ bufferSize: 1, refCount: true }),
      map(apiResponse => new Query(apiResponse)),
      tap(q => {
        console.debug('Query:', q);
        this.emitSingleResultReady(q);
      }),
      catchError(err => {
        console.error(err);
        this.errorObject = err;
        return new Observable<undefined>;
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private emitSingleResultReady(query: Query): void {
    if (this.emittedSingleResultReady) return;
    if (query.status === 'done' && query.results?.length === 1) {
      this.emittedSingleResultReady = true;
      this.singleResultReady.emit(query.results[0].id);
    }
  }

  deleteQuery(query_id: string, query_string: string): void {
    this.queryService.deleteQuery(query_id).subscribe({
      next: (data: any) => {
        this.notificationService.show("History Item '" + query_string + "' deleted.", { header: "Deletion Successful", classname: 'bg-success text-light' });
      },
      error: (data: any) => {
        this.notificationService.show("History Item '" + query_string + "' could not be deleted, the backend server may be offline. Please refresh the page and try again later.", { header: "Connection Error", classname: 'bg-danger text-light', delay: 15000 });
      }
    });
  }

  LevelLabel = LevelLabel;

  getLevelLabel(level: Level): string {
    return this.LevelLabel[level] ?? 'level_unknown';
  }

  getBackgroundColor(source: QueryResultSource) {
    if (source.active) {
      return source.color;
    } else {
      return "#bbbbbb"
    }
  }

  getTextColor(source: QueryResultSource) {
    const hex = this.getBackgroundColor(source).replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Perceived luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
}
