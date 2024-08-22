import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchedBusinessComponent } from './matchedBusiness.component';

describe('MainComponent', () => {
  let component: MatchedBusinessComponent;
  let fixture: ComponentFixture<MatchedBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchedBusinessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchedBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
