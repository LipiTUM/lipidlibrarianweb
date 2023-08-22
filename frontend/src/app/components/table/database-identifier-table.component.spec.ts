import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseIdentifierTableComponent } from './database-identifier-table.component';


describe('DatabaseIdentifierTableComponent', () => {
  let component: DatabaseIdentifierTableComponent;
  let fixture: ComponentFixture<DatabaseIdentifierTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DatabaseIdentifierTableComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseIdentifierTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
