import { ElementRef } from '@angular/core';

import { OntologyGraphZoomableBehaviourDirective } from './ontology-graph-zoomable-behaviour.directive';
import { OntologyGraphService } from 'src/app/services/ontology-graph.service';


describe('OntologyGraphZoomableBehaviourDirective', () => {
  it('should create an instance', () => {
    const directive = new OntologyGraphZoomableBehaviourDirective(new OntologyGraphService, new ElementRef(""));
    expect(directive).toBeTruthy();
  });
});
