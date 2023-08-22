import { Injectable, TemplateRef } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.notifications.push({ textOrTpl, ...options });
  }

  remove(notification: any) {
    this.notifications = this.notifications.filter((n) => n !== notification);
  }

  clear() {
    this.notifications.splice(0, this.notifications.length);
  }
}
