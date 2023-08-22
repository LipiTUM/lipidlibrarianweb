import { Component, OnInit } from '@angular/core';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { HistoryService } from 'src/app/services/history.service';
import { DocumentationDocumentComponent } from '../documentation-document/documentation-document.component';


@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    RouterLink,
    NgbNavModule,
    DocumentationDocumentComponent
  ],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.sass'],
})
export class DocumentationComponent implements OnInit {
  docs: Array<{title: string, fragment: string}> = [
    {title: 'API', fragment: 'api'},
    {title: 'Query', fragment: 'query'},
    {title: 'History', fragment: 'history'},
    {title: 'Token', fragment: 'token'}
  ];

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private historyService: HistoryService
  ) { }

  ngOnInit(): void {
    this.historyService.setActive("", "");
    this.route.fragment.subscribe(fragment => {
      if (!fragment) {
        this.router.navigate(['documentation'], { fragment: 'api' });
      }
    });
  }
}
