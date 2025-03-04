import { Component, OnInit, isDevMode } from '@angular/core';
import { NgIf, AsyncPipe, JsonPipe, NgFor, NgStyle, ViewportScroller, LocationStrategy } from '@angular/common';
import { ActivatedRoute, IsActiveMatchOptions, ParamMap, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, first, switchMap } from 'rxjs/operators';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Lipid } from "src/app/models/lipid.model";
import { StructureIdentifier } from 'src/app/models/structure-identifier.model';
import { Synonym } from 'src/app/models/synonym.model';
import { QueryService } from 'src/app/services/query.service';
import { AdductTableComponent } from '../table/adduct-table.component';
import { FragmentTableComponent } from '../table/fragment-table.component';
import { SynonymTableComponent } from '../table/synonym-table.component';
import { DatabaseIdentifierTableComponent } from '../table/database-identifier-table.component';
import { StructureIdentifierTableComponent } from '../table/structure-identifier-table.component';
import { OntologyGraphComponent } from '../ontology/ontology-graph.component';
import { ScrollSpyDirective } from 'src/app/directives/scrollspy.directive';


@Component({
    selector: 'app-lipid',
    imports: [
        NgIf,
        NgFor,
        NgStyle,
        AsyncPipe,
        JsonPipe,
        RouterLink,
        RouterLinkActive,
        NgbAccordionModule,
        NgbTooltipModule,
        AdductTableComponent,
        FragmentTableComponent,
        SynonymTableComponent,
        DatabaseIdentifierTableComponent,
        StructureIdentifierTableComponent,
        OntologyGraphComponent,
        ScrollSpyDirective
    ],
    templateUrl: './lipid.component.html',
    styleUrls: ['./lipid.component.sass']
})
export class LipidComponent implements OnInit {
  lipid$!: Observable<Lipid | undefined>;
  errorObject: any;

  public linkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'ignored',
    queryParams: 'ignored',
    paths: 'subset',
    fragment: 'exact',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private queryService: QueryService,
    private sanitizer: DomSanitizer,
    private viewportScroller: ViewportScroller,
    public locationStrategy: LocationStrategy
  ) { }

  ngOnInit() {
    // Initialize lipid$ to cange along with the URL params
    this.lipid$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.errorObject = undefined;
        return this.queryService.getLipid(params.get('lipid_id')!);
      }),
      catchError((err: any) => {
        this.errorObject = err;
        return of(undefined);
      })
    );

    // initialize scrollspy behaviour
    const offset_globalNavbar: number = 56;
    const offset_margin: number = 24;
    this.viewportScroller.setOffset([0, offset_globalNavbar + offset_margin])
    this.route.fragment.pipe(first(), debounceTime(200)).subscribe(
      fragment => {
        if (fragment) {
          this.viewportScroller.scrollToAnchor(fragment);
        }
      }
    );
  }

  onSectionChange(fragment: string) {
    if (fragment === "") {
      this.router.navigate([]);
    }
    this.router.navigate([], { fragment: fragment });
  }

  scrollTo(section: string) {
    this.viewportScroller.scrollToAnchor(section);
  }

  isDevelopmentDeployment(): boolean {
    return(isDevMode());
  }

  getBackendPreviewURL(lipid: Lipid): string {
    return(this.getBackendUrl('preview', this.getStructureForRender(lipid)) ?? '');
  }

  getBackendExamplePreviewURL(lipid: Lipid): string {
    return(this.getBackendUrl('preview', this.getExampleStructureForRender(lipid)) ?? '');
  }

  getBackendSpeakURL(lipid: Lipid): string {
    return(this.getBackendUrl('speak', this.getDefinitionForRender(lipid)) ?? '');
  }

  getBackendUrl(endpoint: 'preview' | 'speak', str: string | undefined): string | null {
    if (!str) {
      return null;
    }
    return(window.location.origin + this.locationStrategy.getBaseHref() + "api/" + endpoint + "/" + encodeURIComponent(str));
  }

  getExampleStructureForRender(lipid: Lipid): string | undefined {
    if (this.getStructureForRender(lipid) == undefined) {
      return 'InChI=1S/C46H90NO8P/c1-6-8-10-12-14-16-18-20-22-23-25-27-29-31-33-35-37-39-46(49)55-44(43-54-56(50,51)53-41-40-47(3,4)5)42-52-45(48)38-36-34-32-30-28-26-24-21-19-17-15-13-11-9-7-2/h20,22,44H,6-19,21,23-43H2,1-5H3/b22-20-/t44-/m1/s1';
    } else {
      return undefined;
    }
  }

  getStructureForRender(lipid: Lipid): string | undefined {
    let best_identifier: StructureIdentifier | undefined;
    for (let structure_identifier of lipid.nomenclature.structure_identifiers) {
      if (structure_identifier.structure_type?.toLowerCase() === 'inchi') {
        if (structure_identifier.value) {
          if (best_identifier?.structure_type?.toLowerCase() === 'inchi') {
            if (best_identifier.value && best_identifier.value.length < structure_identifier.value.length) {
              best_identifier = structure_identifier;
            }
          } else {
            best_identifier = structure_identifier;
          }
        }
      } else if (structure_identifier.structure_type?.toLowerCase() === 'smiles') {
        if (structure_identifier.value) {
          if (best_identifier && best_identifier.structure_type?.toLowerCase() !== 'inchi') {
            if (best_identifier.value && best_identifier.value.length < structure_identifier.value.length) {
              best_identifier = structure_identifier;
            }
          } else {
            best_identifier = structure_identifier;
          }
        }
      }
    }
    if (best_identifier && best_identifier.value && best_identifier.value.length > 0) {
      return best_identifier.value;
    } else {
      return undefined;
    }
  }

  getDefinitionForRender(lipid: Lipid): string | undefined {
    let best_synonym: Synonym | undefined;
    for (let synonym of lipid.nomenclature.synonyms) {
      if (synonym.synonym_type === 'definition') {
        if (synonym.value) {
            best_synonym = synonym;
        }
      } else {
        if (synonym.value) {
          if (best_synonym?.synonym_type !== 'definition') {
            if (!best_synonym || !best_synonym.value) {
              best_synonym = synonym;
            } else if (best_synonym.value.length < synonym.value.length) {
              best_synonym = synonym;
            }
          }
        }
      }
    }
    if (best_synonym && best_synonym?.value) {
      return best_synonym.value;
    } else {
      return undefined;
    }
  }

  generateDownloadUrl(lipid: Lipid): SafeUrl {
    const data = JSON.stringify(lipid);
    const blob = new Blob([data], { type: 'text/json' });
    return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
  }

  generatePDF(lipid: Lipid) {
    let docDefinition: TDocumentDefinitions = {
      styles: {
        default: { fontSize: 15, bold: true },
        header: { fontSize: 22, bold: true },
        anotherStyle: { italics: true, alignment: 'right' }
      },

      footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
      content: [
        { text: lipid.nomenclature.name!, style: 'header' },
        { image: 'render', width: 350 },
        { text: lipid.nomenclature.sum_formula! },
        {
          table: {
            headerRows: 1,
            widths: [ '*', 'auto', 100, '*' ],
            body: [
              [ 'First', 'Second', 'Third', 'The last one' ],
              [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
              [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
            ]
          },
          layout: 'lightHorizontalLines'
        }
      ],
      images: {
        render: {
          url: this.getBackendPreviewURL(lipid)
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
