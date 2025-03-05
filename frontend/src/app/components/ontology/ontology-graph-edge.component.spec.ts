import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologyGraphEdgeComponent } from './ontology-graph-edge.component';


describe('OntologyGraphEdgeComponent', () => {
  let component: OntologyGraphEdgeComponent;
  let fixture: ComponentFixture<OntologyGraphEdgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OntologyGraphEdgeComponent]
    });
    fixture = TestBed.createComponent(OntologyGraphEdgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
