import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdductTableComponent } from './adduct-table.component';


describe('AdductTableComponent', () => {
  let component: AdductTableComponent;
  let fixture: ComponentFixture<AdductTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdductTableComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AdductTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
