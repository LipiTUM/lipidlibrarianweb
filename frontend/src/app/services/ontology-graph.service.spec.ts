import { TestBed } from '@angular/core/testing';

import { OntologyGraphService } from './ontology-graph.service';


describe('OntologyGraphService', () => {
  let service: OntologyGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OntologyGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
