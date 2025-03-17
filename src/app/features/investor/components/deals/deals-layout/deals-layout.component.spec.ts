import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsLayoutComponent } from './deals-layout.component';

describe('DealsLayoutComponent', () => {
  let component: DealsLayoutComponent;
  let fixture: ComponentFixture<DealsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealsLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
