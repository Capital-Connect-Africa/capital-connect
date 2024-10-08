import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubSectorComponet } from './edit-segment.component';

describe('EditSubSectorComponet', () => {
  let component: EditSubSectorComponet;
  let fixture: ComponentFixture<EditSubSectorComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSubSectorComponet]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSubSectorComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
