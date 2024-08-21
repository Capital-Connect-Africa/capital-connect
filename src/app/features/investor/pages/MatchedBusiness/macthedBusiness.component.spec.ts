import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchedBusinesComponent } from './matchedBusiness.component';

describe('DashboardComponent', () => {
  let component: MatchedBusinesComponent;
  let fixture: ComponentFixture<MatchedBusinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchedBusinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchedBusinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
