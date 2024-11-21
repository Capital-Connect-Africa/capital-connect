import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferalsComponent } from './referals.component';

describe('ReferalsComponent', () => {
  let component: ReferalsComponent;
  let fixture: ComponentFixture<ReferalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
