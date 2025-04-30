import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHouseInvestorsComponent } from './in-house-investors.component';

describe('InHouseInvestorsComponent', () => {
  let component: InHouseInvestorsComponent;
  let fixture: ComponentFixture<InHouseInvestorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InHouseInvestorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHouseInvestorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
