import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousSessionsComponent } from './previous-sessions.component';

describe('PreviousSessionsComponent', () => {
  let component: PreviousSessionsComponent;
  let fixture: ComponentFixture<PreviousSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousSessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
