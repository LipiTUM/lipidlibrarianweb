import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { QueryService } from 'src/app/services/query.service';


@Component({
    selector: 'app-url-query-redirect',
    imports: [
        NgIf,
        NgbProgressbarModule,
    ],
    templateUrl: './url-query-redirect.component.html',
    styleUrls: ['./url-query-redirect.component.sass']
})
export class UrlQueryRedirectComponent implements OnInit {

  errorMessage?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private queryService: QueryService,
  ) {}

  ngOnInit(): void {
    const queryString = this.route.snapshot.queryParamMap.get('q') ?? '';
    const queryFilters = this.route.snapshot.queryParamMap.get('filters') ?? '';

    if (!queryString.trim()) {
      // Nothing to search, send the user home
      this.router.navigate(['/']);
      return;
    }

    this.queryService.executeQuery(queryString, queryFilters).subscribe({
      next: (data: any) => {
        this.router.navigate(['/query', data.id]);
      },
      error: (err: any) => {
        console.error('[SearchRedirectComponent] executeQuery failed', err);
        this.errorMessage =
          'Could not start the query. The backend may be offline. Redirecting home…';
        setTimeout(() => this.router.navigate(['/']), 3000);
      },
    });
  }

}
