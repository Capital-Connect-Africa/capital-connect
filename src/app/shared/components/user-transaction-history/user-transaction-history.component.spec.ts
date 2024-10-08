import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTransactionHistoryComponent } from './user-transaction-history.component';

describe('UserTransactionHistoryComponent', () => {
  let component: UserTransactionHistoryComponent;
  let fixture: ComponentFixture<UserTransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTransactionHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
