import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FragmentTableComponent } from './fragment-table.component';


describe('FragmentTableComponent', () => {
  let component: FragmentTableComponent;
  let fixture: ComponentFixture<FragmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FragmentTableComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(FragmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
