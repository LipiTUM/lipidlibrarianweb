import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { QueryComponent } from './components/query/query.component';
import { LipidComponent } from './components/lipid/lipid.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { AboutComponent } from './components/about/about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UrlQueryRedirectComponent } from './components/url-query-redirect/url-query-redirect.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'url-query', component: UrlQueryRedirectComponent },
  { path: 'query/:query_id', component: QueryComponent },
  { path: 'lipid/:lipid_id', component: LipidComponent },
  { path: 'documentation', component: DocumentationComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: PageNotFoundComponent },
];
