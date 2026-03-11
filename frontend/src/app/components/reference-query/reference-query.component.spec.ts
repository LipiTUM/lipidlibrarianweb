import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceQueryComponent } from './reference-query.component';


describe('ReferenceQueryComponent', () => {
  let component: ReferenceQueryComponent;
  let fixture: ComponentFixture<ReferenceQueryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ReferenceQueryComponent]
});
    fixture = TestBed.createComponent(ReferenceQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
