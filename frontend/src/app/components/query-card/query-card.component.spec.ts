import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryCardComponent } from './query-card.component';


describe('QueryCardComponent', () => {
  let component: QueryCardComponent;
  let fixture: ComponentFixture<QueryCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [QueryCardComponent]
});
    fixture = TestBed.createComponent(QueryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
