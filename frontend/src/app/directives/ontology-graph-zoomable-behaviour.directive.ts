import { Directive, Input, ElementRef } from '@angular/core';

import { OntologyGraphService } from 'src/app/services/ontology-graph.service';


@Directive({
  selector: '[zoomableOf]',
  standalone: true,
})
export class OntologyGraphZoomableBehaviourDirective {
  @Input('zoomableOf') zoomableOf!: ElementRef;

  constructor(private ontologyGraphService: OntologyGraphService, private _element: ElementRef) { }

  ngOnInit() {
    this.ontologyGraphService.applyZoomableBehaviour(this.zoomableOf, this._element.nativeElement);
  }
}
