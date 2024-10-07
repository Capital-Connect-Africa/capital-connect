import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsectorCardComponent } from './segment-card.component';

describe('SubsectorCardComponent', () => {
  let component: SubsectorCardComponent;
  let fixture: ComponentFixture<SubsectorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubsectorCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubsectorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
