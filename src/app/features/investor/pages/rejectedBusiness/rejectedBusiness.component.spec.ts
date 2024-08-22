import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedBusinesComponent } from './rejectedBusiness.component';

describe('DashboardComponent', () => {
  let component: ConnectedBusinesComponent;
  let fixture: ComponentFixture<ConnectedBusinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedBusinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectedBusinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
