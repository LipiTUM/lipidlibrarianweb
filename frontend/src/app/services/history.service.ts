import { Injectable } from '@angular/core';

import { SessionService } from './session.service';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private sessionService: SessionService) { }

  setActive(query_id: string, lipid_id: string): void {
    if (this.sessionService.getCookieConsentStatus()) {
      localStorage.setItem("history_active", query_id + '_' + lipid_id);
    }
  }

  getActive(query_id: string, lipid_id: string): boolean | null {
    try {
      return localStorage.getItem("history_active") === query_id + '_' + lipid_id;
    } catch (e:any){
      return null;
    }
  }

  updateCollapsed(query_id: string): void {
    if (this.sessionService.getCookieConsentStatus()) {
      if (this.getCollapsed(query_id)) {
        localStorage.setItem("history_collapsed_" + query_id, "false");
      } else {
        localStorage.setItem("history_collapsed_" + query_id, "true");
      }
    }
  }

  getCollapsed(query_id: string): boolean {
    try {
      if (localStorage.getItem("history_collapsed_" + query_id) === "true") {
        return true;
      }
    } catch (e:any){
      return false;
    }
    return false;
  }
}
