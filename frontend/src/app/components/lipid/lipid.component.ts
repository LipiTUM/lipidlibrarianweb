import { Component, OnInit, isDevMode } from '@angular/core';
import { NgIf, AsyncPipe, JsonPipe, NgFor, NgStyle, ViewportScroller, LocationStrategy, DecimalPipe } from '@angular/common';
import { ActivatedRoute, IsActiveMatchOptions, ParamMap, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of, map } from 'rxjs';
import { catchError, debounceTime, first, switchMap } from 'rxjs/operators';

//import * as pdfMake from "pdfmake/build/pdfmake";
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';
//(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Lipid } from "src/app/models/lipid.model";
import { StructureIdentifier } from 'src/app/models/structure-identifier.model';
import { Synonym } from 'src/app/models/synonym.model';
import { QueryService } from 'src/app/services/query.service';
import { AdductTableComponent } from '../table/adduct-table.component';
import { FragmentTableComponent } from '../table/fragment-table.component';
import { SynonymTableComponent } from '../table/synonym-table.component';
import { StructureIdentifierTableComponent } from '../table/structure-identifier-table.component';
import { OntologyGraphComponent } from '../ontology/ontology-graph.component';
import { ScrollSpyDirective } from 'src/app/directives/scrollspy.directive';
import { Source } from 'src/app/models/source.model';
import { Level, LevelLabel } from 'src/app/models/level.enum';
import { Reaction } from 'src/app/models/reaction.model';


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
        DecimalPipe,
        NgbAccordionModule,
        NgbTooltipModule,
        AdductTableComponent,
        FragmentTableComponent,
        SynonymTableComponent,
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
      map(data => new Lipid(data)),
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

  LevelLabel = LevelLabel;

  getLevelLabel(level: Level): string {
    return this.LevelLabel[level] ?? 'level_unknown';
  }

  formatSourceName(source: string): string {
    const displayNames: Record<string, string> = {
      lipidlibrarian:'Goslin | LipidLynxX',
      swisslipids: 'SwissLipids',
      lipidmaps: 'LIPID MAPS',
      lipid_maps: 'LIPID MAPS',
      'lipid maps': 'LIPID MAPS',
      alex123: 'ALEX¹²³',
      linex: 'LINEX',
      lionweb: 'LION/web',
      lion_web: 'LION/web',
      'lion/web': 'LION/web',
      lion: 'LION/web',
      chebi: 'ChEBI',
      metanetx: 'MetaNetX',
      hmdb: 'HMDB',
      pubchem: 'PubChem',
      kegg: 'KEGG',
    };

    return displayNames[source.toLowerCase()] ?? source;
  }

  hasFragments(lipid: Lipid): boolean {
    return lipid.adducts.some(adduct => adduct.fragments.length > 0);
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

  getOntologySources(lipid: Lipid): Source[] {
    const seen = new Set<string>();
    const result: Source[] = [];
    for (const src of lipid.ontology.sources) {
      if (!seen.has(src.source)) {
        seen.add(src.source);
        result.push(src);
      }
    }
    return result;
  }

  getMassTypeTooltip(massType: string): string {
    const definitions: Record<string, string> = {
      'average mass':       'Weighted average of all naturally occurring isotopes of each element, reflecting natural isotopic abundances. Typically used in low-resolution mass spectrometry.',
      'monoisotopic mass':  'Mass calculated using only the most abundant isotope of each element. The standard in high-resolution mass spectrometry.',
      'neutral mass':       'Mass of the uncharged, adduct-free molecule. Reported by SwissLipids.',
    };
    return definitions[massType.trim().toLowerCase()] ?? '';
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

  getGroupedMasses(lipid: Lipid): { mass_type: string; value: number; sources: Source[] }[] {
    const groups = new Map<string, { mass_type: string; value: number; sources: Source[] }>();

    for (const mass of lipid.masses) {
      const key = `${mass.mass_type}__${mass.value}`;
      if (groups.has(key)) {
        groups.get(key)!.sources.push(...mass.sources);
      } else {
        groups.set(key, {
          mass_type: mass.mass_type!,
          value: mass.value!,
          sources: [...mass.sources]
        });
      }
    }

    // Deduplicate sources within each group by source name
    for (const group of groups.values()) {
      const seen = new Set<string>();
      group.sources = group.sources.filter(src => {
        if (seen.has(src.source)) return false;
        seen.add(src.source);
        return true;
      });
    }
    return Array.from(groups.values());
  }

  getReactionDescription(reaction: Reaction): string {
    if (reaction.description?.trim()) {
      return reaction.description.replace('</smallsup>', '');
    }
    const phospholipase_pc = reaction.database_identifiers.find(
      dbid => dbid.identifier === 'RHEA:32907'
    );
    const phospholipase_pe = reaction.database_identifiers.find(
      dbid => dbid.identifier === 'RHEA:32971'
    );
    const pi_to_pa = reaction.database_identifiers.find(
      dbid => dbid.identifier === 'RHEA:10832'
    );
    if (phospholipase_pc) {
      return 'PC = HG(PC) + FA + FA';
    }
    if (phospholipase_pe) {
      return 'PE = HG(PE) + FA + FA';
    }
    if (pi_to_pa) {
      return 'PI = PA';
    }
    return 'Unknown reaction';
  }

  getSourcesWithoutDatabaseIdentifier(lipid: Lipid) {
    const databaseNames = new Set(
      lipid.database_identifiers.map(dbid => dbid.database)
    );
    return lipid.sources.filter(src => !databaseNames.has(src.source));
  }

  generateDownloadUrlJSON(): string {
  const lipidId = this.route.snapshot.paramMap.get('lipid_id');
  return window.location.origin
    + this.locationStrategy.getBaseHref()
    + 'api/lipid/'
    + lipidId;
}

  generateDownloadUrlHTML(): string {
    const lipidId = this.route.snapshot.paramMap.get('lipid_id');
    return window.location.origin
      + this.locationStrategy.getBaseHref()
      + 'api/lipid-html/'
      + lipidId;
  }
}
