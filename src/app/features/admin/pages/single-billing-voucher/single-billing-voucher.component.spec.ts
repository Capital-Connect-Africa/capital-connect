import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBillingVoucherComponent } from './single-billing-voucher.component';

describe('SingleBillingVoucherComponent', () => {
  let component: SingleBillingVoucherComponent;
  let fixture: ComponentFixture<SingleBillingVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleBillingVoucherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBillingVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
