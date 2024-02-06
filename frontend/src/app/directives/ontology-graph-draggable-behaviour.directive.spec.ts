import { ElementRef } from '@angular/core';

import { OntologyGraphDraggableBehaviourDirective } from './ontology-graph-draggable-behaviour.directive';
import { OntologyGraphService } from 'src/app/services/ontology-graph.service';


describe('OntologyGraphDraggableBehaviourDirective', () => {
  it('should create an instance', () => {
    const directive = new OntologyGraphDraggableBehaviourDirective(new OntologyGraphService, new ElementRef(""));
    expect(directive).toBeTruthy();
  });
});
