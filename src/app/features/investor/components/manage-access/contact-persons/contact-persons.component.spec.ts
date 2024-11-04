import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPersonsComponent } from './contact-persons.component';

describe('ContactPersonsComponent', () => {
  let component: ContactPersonsComponent;
  let fixture: ComponentFixture<ContactPersonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPersonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
