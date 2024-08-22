import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterstingBusinesComponent } from './interestingBusiness.component';

describe('DashboardComponent', () => {
  let component: InterstingBusinesComponent;
  let fixture: ComponentFixture<InterstingBusinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterstingBusinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterstingBusinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
