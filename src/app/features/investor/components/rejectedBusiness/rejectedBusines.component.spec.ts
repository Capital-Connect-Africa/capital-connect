import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedBusinessComponent } from './rejectedBusiness.component';

describe('MainComponent', () => {
  let component: RejectedBusinessComponent;
  let fixture: ComponentFixture<RejectedBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedBusinessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectedBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
