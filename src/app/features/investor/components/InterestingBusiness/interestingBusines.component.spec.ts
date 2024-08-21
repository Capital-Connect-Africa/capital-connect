import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestingBusinessComponent } from './interestingBusiness.component';

describe('MainComponent', () => {
  let component: InterestingBusinessComponent;
  let fixture: ComponentFixture<InterestingBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestingBusinessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterestingBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
