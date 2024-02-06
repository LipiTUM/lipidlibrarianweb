import { Directive, Input, ElementRef } from '@angular/core';

import { OntologyGraph } from 'src/app/models/ontology-graph.model';
import { OntologyGraphNode } from 'src/app/models/ontology-graph-node.model';
import { OntologyGraphService } from 'src/app/services/ontology-graph.service';


@Directive({
  selector: '[draggableNode]',
  standalone: true,
})
export class OntologyGraphDraggableBehaviourDirective {
  @Input('draggableNode') draggableNode!: OntologyGraphNode;
  @Input('draggableInGraph') draggableInGraph!: OntologyGraph;

  constructor(private ontologyGraphService: OntologyGraphService, private _element: ElementRef) { }

  ngOnInit() {
      this.ontologyGraphService.applyDraggableBehaviour(this._element.nativeElement, this.draggableNode, this.draggableInGraph);
  }
}
