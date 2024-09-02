import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCriteriaComponent } from './special-criteria.component';

describe('SpecialCriteriaComponent', () => {
  let component: SpecialCriteriaComponent;
  let fixture: ComponentFixture<SpecialCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialCriteriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
