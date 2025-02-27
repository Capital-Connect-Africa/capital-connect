import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFilePreviewComponent } from './data-file-preview.component';

describe('DataFilePreviewComponent', () => {
  let component: DataFilePreviewComponent;
  let fixture: ComponentFixture<DataFilePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFilePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataFilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
