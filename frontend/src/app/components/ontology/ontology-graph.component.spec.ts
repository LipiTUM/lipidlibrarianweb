import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologyGraphComponent } from './ontology-graph.component';


describe('OntologyGraphComponent', () => {
  let component: OntologyGraphComponent;
  let fixture: ComponentFixture<OntologyGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OntologyGraphComponent]
    });
    fixture = TestBed.createComponent(OntologyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
