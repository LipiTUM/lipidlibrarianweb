import { ApplicationConfig, SecurityContext, importProvidersFrom } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MARKED_OPTIONS, provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideMarkdown({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          gfm: true,
          breaks: false,
          pedantic: false,
        },
      },
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    DecimalPipe,
    provideRouter(routes)
  ]
};
