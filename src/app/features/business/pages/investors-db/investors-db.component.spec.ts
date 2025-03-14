import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorsDbComponent } from './investors-db.component';

describe('InvestorsDbComponent', () => {
  let component: InvestorsDbComponent;
  let fixture: ComponentFixture<InvestorsDbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorsDbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorsDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
