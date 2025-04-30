import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalInvestorDbComponent } from './global-investor-db.component';

describe('GlobalInvestorDbComponent', () => {
  let component: GlobalInvestorDbComponent;
  let fixture: ComponentFixture<GlobalInvestorDbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalInvestorDbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalInvestorDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
