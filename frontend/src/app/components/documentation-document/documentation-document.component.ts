import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MarkdownModule } from 'ngx-markdown';


@Component({
  selector: 'app-documentation-document',
  standalone: true,
  imports: [
    MarkdownModule
  ],
  templateUrl: './documentation-document.component.html',
  styleUrls: ['./documentation-document.component.sass']
})
export class DocumentationDocumentComponent implements OnChanges {
  @Input() documentationDocument$?: Observable<string | null>;
  documentationMarkdown: string = "";

  constructor(private httpClient: HttpClient) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.documentationDocument$!.subscribe(documentationDocument => {
      if (documentationDocument) {
        this.httpClient.get('assets/documentation/' + documentationDocument + '.md', { responseType: 'text' }).subscribe(text => {
          this.documentationMarkdown = text;
        });
      }
    });
  }
}
