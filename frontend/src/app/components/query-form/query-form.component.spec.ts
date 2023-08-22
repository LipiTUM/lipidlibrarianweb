import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryFormComponent } from './query-form.component';


describe('QueryFormComponent', () => {
  let component: QueryFormComponent;
  let fixture: ComponentFixture<QueryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [QueryFormComponent]
});
    fixture = TestBed.createComponent(QueryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
