import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbActiveModal, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from 'src/app/services/session.service';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
    selector: 'app-cookieconsent',
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        NgbAlertModule
    ],
    templateUrl: './cookieconsent.component.html',
    styleUrls: ['./cookieconsent.component.sass']
})
export class CookieConsentComponent {

  cookieConsentForm: FormGroup = new FormGroup({
    enable_session_tracking_cookies: new FormControl(this.sessionService.getCookieConsentStatus())
  });

  constructor(
    public activeModal: NgbActiveModal,
    public sessionService: SessionService,
    private notificationService: NotificationService
  ) {}

  get f(): { [key: string]: AbstractControl } {
    return this.cookieConsentForm.controls;
  }

  onSubmit(): void {
    var cookieConsentFormValues = this.cookieConsentForm.value;
    this.sessionService.setCookieConsentStatus(cookieConsentFormValues.enable_session_tracking_cookies);
    this.notificationService.show('Successfully updated cookie policy.', { classname: 'bg-success text-light' });
    this.activeModal.close('Submit');
  }
}
