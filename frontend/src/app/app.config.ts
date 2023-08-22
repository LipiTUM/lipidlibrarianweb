import { ApplicationConfig, SecurityContext, importProvidersFrom } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      MarkdownModule.forRoot({
        loader: HttpClient,
        sanitize: SecurityContext.NONE,
        markedOptions: {
          provide: MarkedOptions,
          useValue: {
            gfm: true,
            breaks: false,
            pedantic: false,
            smartLists: true,
            smartypants: false,
          },
        },
      })
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    DecimalPipe,
    provideRouter(routes)
  ]
};
