import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppQrCodeComponent } from './app-qr-code.component';

describe('AppQrCodeComponent', () => {
  let component: AppQrCodeComponent;
  let fixture: ComponentFixture<AppQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppQrCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
