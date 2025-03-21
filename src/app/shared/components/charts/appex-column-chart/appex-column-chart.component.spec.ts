import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppexColumnChartComponent } from './appex-column-chart.component';

describe('AppexColumnChartComponent', () => {
  let component: AppexColumnChartComponent;
  let fixture: ComponentFixture<AppexColumnChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppexColumnChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppexColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
