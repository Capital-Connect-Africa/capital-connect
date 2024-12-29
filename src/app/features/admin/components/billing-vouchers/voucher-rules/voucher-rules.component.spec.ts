import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherRulesComponent } from './voucher-rules.component';

describe('VoucherRulesComponent', () => {
  let component: VoucherRulesComponent;
  let fixture: ComponentFixture<VoucherRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
