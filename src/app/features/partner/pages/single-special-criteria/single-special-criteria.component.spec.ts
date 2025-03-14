import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSpecialCriteriaComponent } from './single-special-criteria.component';

describe('SingleSpecialCriteriaComponent', () => {
  let component: SingleSpecialCriteriaComponent;
  let fixture: ComponentFixture<SingleSpecialCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleSpecialCriteriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleSpecialCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
