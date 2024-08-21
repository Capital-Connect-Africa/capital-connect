import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedBusinessComponent } from './connectedBusiness.component';

describe('MainComponent', () => {
  let component: ConnectedBusinessComponent;
  let fixture: ComponentFixture<ConnectedBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedBusinessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectedBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
