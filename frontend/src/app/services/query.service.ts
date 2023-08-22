import { Injectable } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SessionService } from './session.service';
import { Lipid } from '../models/lipid.model';



@Injectable({
  providedIn: 'root'
})
export class QueryService {

  backend_url: string;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private locationStrategy: LocationStrategy
  ) { 
    this.backend_url = window.location.origin + this.locationStrategy.getBaseHref();
  }

  /**
   * Executes a query with lipid librarian.
   * @param query_type - either search_term or m/z search
   * @param query_string - The query string for which lipids to search for.
   * @param query_filters - Filters to adjust the query like selected sources, result cutoff and amount of requeries
   * @returns An Observable, which should contain the lipids as json.
   */
  executeQuery(query_string: string, query_filters: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('query_string', query_string);
    formData.append('query_filters', query_filters);
    formData.append('token', this.sessionService.getToken());

    console.log("[query.service::executeQuery] Created Query: " + 'api/query'  + "; formData: " + formData.get('query_string') + ", " + formData.get('query_filters') + ", " + formData.get('token') + ";")
    return this.http.post(this.backend_url + 'api/query', formData)
  }

  getLipid(lipid_id: string): Observable<any> {
    const lipid_data: string | null = localStorage.getItem(lipid_id)
    if (lipid_data != null) {
      return of(lipid_data);
    }
    return this.http.get(this.backend_url + 'api/lipid/' + lipid_id);
  }

  cacheLipid(lipid: Lipid): void {
    if (this.sessionService.getCookieConsentStatus()) {
      localStorage.setItem(lipid.id, JSON.stringify(lipid));
    }
  }

  getQuery(query_id: string): Observable<any> {
    return this.http.get(this.backend_url + 'api/query/' + query_id);
  }

  /**
   * Gets information on all Query objects, for a specific token, from the backend.
   * @returns An Observable, which should contain information about all
   * histories associated to the current session token
   */
  getQueries(): Observable<any> {
    let params = {
      token: this.sessionService.getToken(),
    }
    return this.http.get(this.backend_url + 'api/query', {params: params});
  }

  deleteQuery(query_id: string): Observable<any> {
    return this.http.delete(this.backend_url + 'api/query/' + query_id);
  }
}
