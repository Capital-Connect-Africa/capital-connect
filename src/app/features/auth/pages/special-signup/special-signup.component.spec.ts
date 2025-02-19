import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialSignupComponent } from './special-signup.component';

describe('SpecialSignupComponent', () => {
  let component: SpecialSignupComponent;
  let fixture: ComponentFixture<SpecialSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialSignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
