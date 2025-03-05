import { Directive, ElementRef } from '@angular/core';

import { OntologyGraphService } from 'src/app/services/ontology-graph.service';


@Directive({
  selector: 'zoomable',
  standalone: true,
})
export class OntologyGraphZoomableBehaviourDirective {

  constructor(private ontologyGraphService: OntologyGraphService, private _element: ElementRef) { }

  ngOnInit() {
    this.ontologyGraphService.applyZoomableBehaviour(this._element.nativeElement.parentElement, this._element);
  }
}
