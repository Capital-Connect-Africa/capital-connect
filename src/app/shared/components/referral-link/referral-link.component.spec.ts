import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralLinkComponent } from './referral-link.component';

describe('ReferralLinkComponent', () => {
  let component: ReferralLinkComponent;
  let fixture: ComponentFixture<ReferralLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
