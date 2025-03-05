import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologyGraphNodeComponent } from './ontology-graph-node.component';


describe('OntologyGraphNodeComponent', () => {
  let component: OntologyGraphNodeComponent;
  let fixture: ComponentFixture<OntologyGraphNodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OntologyGraphNodeComponent]
    });
    fixture = TestBed.createComponent(OntologyGraphNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
