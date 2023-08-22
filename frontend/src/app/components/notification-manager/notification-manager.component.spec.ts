import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationManagerComponent } from './notification-manager.component';

describe('NotificationManagerComponent', () => {
  let component: NotificationManagerComponent;
  let fixture: ComponentFixture<NotificationManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotificationManagerComponent]
    });
    fixture = TestBed.createComponent(NotificationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
