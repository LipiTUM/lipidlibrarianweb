import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureIdentifierTableComponent } from './structure-identifier-table.component';


describe('StructureIdentifierTableComponent', () => {
  let component: StructureIdentifierTableComponent;
  let fixture: ComponentFixture<StructureIdentifierTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [StructureIdentifierTableComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(StructureIdentifierTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
