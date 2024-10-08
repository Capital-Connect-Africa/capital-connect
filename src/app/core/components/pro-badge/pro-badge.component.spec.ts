import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProBadgeComponent } from './pro-badge.component';

describe('ProBadgeComponent', () => {
  let component: ProBadgeComponent;
  let fixture: ComponentFixture<ProBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProBadgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
