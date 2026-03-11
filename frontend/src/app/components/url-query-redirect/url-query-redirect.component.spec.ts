import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlQueryRedirectComponent } from './url-query-redirect.component';


describe('UrlQueryRedirectComponent', () => {
  let component: UrlQueryRedirectComponent;
  let fixture: ComponentFixture<UrlQueryRedirectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UrlQueryRedirectComponent]
});
    fixture = TestBed.createComponent(UrlQueryRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
