import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynonymTableComponent } from './synonym-table.component';


describe('SynonymTableComponent', () => {
  let component: SynonymTableComponent;
  let fixture: ComponentFixture<SynonymTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SynonymTableComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SynonymTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
