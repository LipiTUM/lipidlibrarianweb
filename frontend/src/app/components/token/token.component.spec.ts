import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenComponent } from './token.component';


describe('TokenComponent', () => {
  let component: TokenComponent;
  let fixture: ComponentFixture<TokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TokenComponent]
});
    fixture = TestBed.createComponent(TokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
