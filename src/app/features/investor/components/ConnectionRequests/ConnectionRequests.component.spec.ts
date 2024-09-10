import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionRequestsComponent } from './ConnectionRequests.component';

describe('MainComponent', () => {
  let component: ConnectionRequestsComponent;
  let fixture: ComponentFixture<ConnectionRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
