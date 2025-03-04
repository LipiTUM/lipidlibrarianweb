import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsActiveMatchOptions, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { NgbDropdownModule, NgbModal, NgbOffcanvas, NgbOffcanvasOptions, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Query } from './models/query.model';
import { QueryService } from './services/query.service';
import { SessionService } from './services/session.service';
import { CookieConsentComponent } from './components/cookieconsent/cookieconsent.component';
import { HistoryComponent } from './components/history/history.component';
import { NotificationManagerComponent } from './components/notification-manager/notification-manager.component';
import { NotificationService } from './services/notification.service';


@Component({
    selector: 'app-root',
    imports: [
        NgStyle,
        NgIf,
        RouterLink,
        RouterLinkActive,
        FormsModule,
        ReactiveFormsModule,
        HistoryComponent,
        RouterOutlet,
        NgbDropdownModule,
        NgbTooltipModule,
        NotificationManagerComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'lipid-librarian-web';
  public getScreenWidth?: number;
  public getScreenHeight?: number;
  private preferredTheme: MediaQueryList = matchMedia('(prefers-color-scheme: dark)');
  public currentTheme?: 'dark' | 'light';
  public currentStoredTheme?: 'dark' | 'light' | 'auto';

  public linkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'ignored',
    queryParams: 'ignored',
    paths: 'subset',
    fragment: 'exact',
  };

  quickSearchForm: FormGroup = new FormGroup({
    query: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    public queryService: QueryService,
    public sessionService: SessionService,
    public offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.currentStoredTheme = this.sessionService.getStoredTheme();
    this.changeTheme(this.sessionService.getPreferredTheme());
    this.preferredTheme.addEventListener('change', (event: MediaQueryListEvent) => {
      this.changeTheme(event.matches ? 'dark' : 'light');
    });
  }

  ngAfterViewInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if (this.sessionService.getCookieConsentStatus() == null) {
      this.sessionService.setCookieConsentStatus(false);
      this.openCookieConsentModal();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.quickSearchForm.controls;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTheme(theme: 'dark' | 'light') {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-bs-theme', theme);
  }

  setPreferredTheme(theme: 'dark' | 'light' | 'auto'): void {
    this.currentStoredTheme = theme;
    this.sessionService.setPreferredTheme(theme);
    this.changeTheme(this.sessionService.getPreferredTheme());
  }

  onSubmit(): void {
    console.log("[app.component::onSubmit] Processing Submit Request;")
    if (this.quickSearchForm.invalid) {
      console.log("[app.component::onSubmit] Processing Submit Request Failed: Form Invalid;")
      return;
    }
    let query_string = this.f['query'].value
    //query filters consists of source; cutoff; requeries
    let query_filters = "source=ALEX123;source=LipidMaps;source=LION;source=LINEX;source=SwissLipids;cutoff=5;requeries=1";
    console.log("[app.component::onSubmit] Processed Submit Request: query_string: " + query_string + "; query filters: "+ query_filters+"; Executing Query;")
    this.queryService.executeQuery(query_string, query_filters).subscribe({
      next: (data: any) => {
        let query = new Query(data);
        console.log("[app.component::onSubmit] Query Executed successfully. " + JSON.stringify(query) + ";")
        this.showQuerySuccessNotification(query_string);
        this.router.navigate(['/', 'query', query.id]).then();
      },
      error: (data: any) => {
        this.showBackendNotAvailableNotification();
        console.log("[app.component::onSubmit] Executing Query returned an Error: " + JSON.stringify(data) + ";")
      }
    });
  }

  openOffcanvas(content: any, options: NgbOffcanvasOptions): void {
    this.offcanvasService.open(content, options);
  }

  openHistoryOffcanvas(): void {
    this.offcanvasService.open(HistoryComponent, { ariaLabelledBy: 'history-offcanvas-title', position: 'end' });
  }

  openCookieConsentModal(): void {
    this.modalService.open(CookieConsentComponent, { backdrop: 'static', fullscreen: 'md', windowClass: 'cookieconsent-modal', backdropClass: 'cookieconsent-modal-backdrop' });
  }

  showQuerySuccessNotification(query_input: string): void {
    this.notificationService.show(
      "Successfully submitted a query for '" + query_input + "'.",
      { classname: "bg-success text-light", header: "Query Submitted" }
    );
  }

  showBackendNotAvailableNotification(): void {
    this.notificationService.show(
      'The backend server is not available right now, therefore no searches and calculations are possible. Please try again later.',
      { classname: 'bg-danger text-light', header: 'Connection Error' }
    );
  }

  showCookiesDisabledNotification(cookieNotificationTpl: any): void {
    this.notificationService.show(cookieNotificationTpl, { classname: 'bg-secondary text-light', delay: 10000 }
    );
  }

  ngOnDestroy(): void {
		this.notificationService.clear();
	}
}
