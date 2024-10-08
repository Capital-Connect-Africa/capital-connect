import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubsectorComponent } from './create-segment.component';

describe('CreateSubsectorComponent', () => {
  let component: CreateSubsectorComponent;
  let fixture: ComponentFixture<CreateSubsectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubsectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSubsectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
