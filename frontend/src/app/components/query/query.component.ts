import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, AsyncPipe, LocationStrategy } from '@angular/common';
import { ActivatedRoute, RouterLink, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, map, of, switchMap, forkJoin, firstValueFrom } from 'rxjs';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Query } from 'src/app/models/query.model';
import { BulkQuery } from 'src/app/models/bulk-query.model';
import { QueryService } from 'src/app/services/query.service';
import { NotificationService } from 'src/app/services/notification.service';
import { QueryCardComponent } from 'src/app/components/query-card/query-card.component';


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

  /** Populated once the initial query/bulk-query response arrives. */
  queryIds: string[] = [];

  isDownloading = false;

  private backendUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private queryService: QueryService,
    private notificationService: NotificationService,
    private http: HttpClient,
    private locationStrategy: LocationStrategy,
  ) {
    this.backendUrl = window.location.origin + this.locationStrategy.getBaseHref();
  }

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
        next: (queries: Query[]) => {
          this.queryIds = queries.map(q => q.id!).filter(Boolean);
        },
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

  onSingleResultReady(lipidId: string, queries: Query[]): void {
    if (queries.length === 1) {
      this.router.navigate(['/lipid', lipidId]);
    }
  }

  // The download-helpers code is AI generated.
  // ---------------------------------------------------------------------------
  // Download helpers
  // ---------------------------------------------------------------------------

  /**
   * Fetches the latest state of every query card, collects unique lipid IDs
   * from completed results, then downloads them all as a zip.
   *
   * @param format  'json' → api/lipid/{id}   |  'html' → api/lipid-html/{id}
   */
  async downloadAll(format: 'json' | 'html'): Promise<void> {
    if (this.isDownloading || !this.queryIds.length) return;
    this.isDownloading = true;

    try {
      // 1. Re-fetch each query to get the most up-to-date results
      const latestQueries: any[] = await firstValueFrom(
        forkJoin(this.queryIds.map(id => this.queryService.getQuery(id)))
      );

      // 2. Collect unique lipid IDs from queries that are done
      const lipidIds = new Set<string>();
      for (const q of latestQueries) {
        if (q?.status === 'done' && Array.isArray(q.results)) {
          for (const r of q.results) {
            if (r?.id) lipidIds.add(r.id);
          }
        }
      }

      if (lipidIds.size === 0) {
        this.notificationService.show(
          'No results are available yet – please wait for all queries to complete.',
          { header: 'Nothing to download', classname: 'bg-warning text-dark' }
        );
        return;
      }

      // 3. Fetch each lipid (JSON or HTML) in parallel
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const ext = format === 'json' ? 'json' : 'html';
      const endpoint = format === 'json' ? 'lipid' : 'lipid-html';

      const fetchTasks = Array.from(lipidIds).map(async id => {
        try {
          if (format === 'json') {
            const data = await firstValueFrom(
              this.http.get(`${this.backendUrl}api/${endpoint}/${id}`)
            );
            zip.file(`${id}.${ext}`, JSON.stringify(data, null, 2));
          } else {
            const data = await firstValueFrom(
              this.http.get(`${this.backendUrl}api/${endpoint}/${id}`, { responseType: 'text' })
            );
            zip.file(`${id}.${ext}`, data);
          }
        } catch (err) {
          console.warn(`Failed to fetch lipid ${id}:`, err);
          // skip failed entries rather than aborting the whole archive
        }
      });

      await Promise.all(fetchTasks);

      // 4. Generate the zip and trigger a browser download
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `lipids_${format}.zip`;
      anchor.click();
      URL.revokeObjectURL(url);

      this.notificationService.show(
        `Downloaded ${lipidIds.size} lipid${lipidIds.size !== 1 ? 's' : ''} as ${format.toUpperCase()}.`,
        { header: 'Download complete', classname: 'bg-success text-light' }
      );
    } catch (err: any) {
      console.error('Download failed:', err);
      this.notificationService.show(
        'Could not generate the archive. The backend server may be offline.',
        { header: 'Download Error', classname: 'bg-danger text-light', delay: 12000 }
      );
    } finally {
      this.isDownloading = false;
    }
  }
}
