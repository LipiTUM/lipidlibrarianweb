import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LipidComponent } from './lipid.component';


describe('LipidComponent', () => {
  let component: LipidComponent;
  let fixture: ComponentFixture<LipidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [LipidComponent]
});
    fixture = TestBed.createComponent(LipidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
