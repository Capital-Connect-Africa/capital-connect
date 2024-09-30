import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCriteriaQuestionsComponent } from './special-criteria-questions.component';

describe('SpecialCriteriaQuestionsComponent', () => {
  let component: SpecialCriteriaQuestionsComponent;
  let fixture: ComponentFixture<SpecialCriteriaQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialCriteriaQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialCriteriaQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
