import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingVouchersComponent } from './billing-vouchers.component';

describe('BillingVouchersComponent', () => {
  let component: BillingVouchersComponent;
  let fixture: ComponentFixture<BillingVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingVouchersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
