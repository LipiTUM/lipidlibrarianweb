import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentComponent } from './cookieconsent.component';


describe('CookieConsentComponent', () => {
  let component: CookieConsentComponent;
  let fixture: ComponentFixture<CookieConsentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CookieConsentComponent]
});
    fixture = TestBed.createComponent(CookieConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
