import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalInvestorsComponent } from './global-investors.component';

describe('GlobalInvestorsComponent', () => {
  let component: GlobalInvestorsComponent;
  let fixture: ComponentFixture<GlobalInvestorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalInvestorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalInvestorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
