import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { v4 as uuidv4 } from 'uuid';


/**
 * SessionService contains all the code for getting, setting and updating the session cookie with the workspace defining token.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private cookieService: CookieService) {
    this.getToken();
  }

  getCookieConsentStatus(): boolean | null {
    if (this.cookieService.check('LipidLibrarianWeb-CookieConsentStatus')) {
      if (this.cookieService.get('LipidLibrarianWeb-CookieConsentStatus') === 'allowed') {
        return true;
      } else {
        return false;
      }
    }
    return null;
  }

  setCookieConsentStatus(status: boolean): void {
    let expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);
    if (status) {
      if (!this.getCookieConsentStatus()) {
        this.cookieService.set('LipidLibrarianWeb-CookieConsentStatus', 'allowed', expiredDate);
        this.setToken(this.generateToken());
      }
    } else {
      this.cookieService.delete('LipidLibrarianWeb-Token');
      this.cookieService.set('LipidLibrarianWeb-CookieConsentStatus', 'denied', expiredDate);
    }
  }

  setPreferredTheme(theme: 'dark' | 'light' | 'auto'): void {
    if (theme === 'auto') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', theme);
    }
  }

  getStoredTheme(): 'dark' | 'light' | 'auto' {
    const storedTheme = localStorage.getItem('theme');

    if (!storedTheme) {
      return 'auto';
    } else if (storedTheme !== 'dark' && storedTheme !== 'light') {
      localStorage.removeItem('theme');
      return 'auto';
    }
    return storedTheme;
  }

  getPreferredTheme(): 'dark' | 'light' {
    let storedTheme = this.getStoredTheme();

    if (storedTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return storedTheme;
  }

  /**
   * Gets the token, or creates a new one, if not.
   * @returns session token
   */
  getToken(): string {
    if (this.getCookieConsentStatus()) {
      if (!this.cookieService.check('LipidLibrarianWeb-Token')) {
        this.setToken(this.generateToken());
      }
      return this.cookieService.get('LipidLibrarianWeb-Token');
    }
    return this.generateToken();
  }

  /**
   * Sets the token.
   * @param token - session token
   */
  setToken(token: string): void {
    if (this.getCookieConsentStatus()) {
      let expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() + 30);
      this.cookieService.set('LipidLibrarianWeb-Token', token, expiredDate);
    }
  }

  /**
   * Generates a new random token.
   * @returns random token
   */
  generateToken(): string {
    return uuidv4();
  }
}
