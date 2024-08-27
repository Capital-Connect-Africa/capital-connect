import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleInvestorComponent } from './single-investor.component';

describe('SingleInvestorComponent', () => {
  let component: SingleInvestorComponent;
  let fixture: ComponentFixture<SingleInvestorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleInvestorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleInvestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
