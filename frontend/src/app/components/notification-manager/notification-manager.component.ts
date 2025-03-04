import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from '../../services/notification.service';


@Component({
    selector: 'app-notification-manager',
    imports: [
        CommonModule,
        NgIf,
        NgFor,
        NgTemplateOutlet,
        NgbToastModule,
    ],
    templateUrl: './notification-manager.component.html',
    styleUrls: ['./notification-manager.component.sass'],
    host: { class: 'toast-container position-fixed top-0 end-0 p-3' }
})
export class NotificationManagerComponent {

  constructor(public notificationService: NotificationService) {}

  isTemplate(notification: any) {
    return notification.textOrTpl instanceof TemplateRef;
  }
}
