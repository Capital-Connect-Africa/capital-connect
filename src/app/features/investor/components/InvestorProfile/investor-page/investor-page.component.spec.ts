/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InvestorPageComponent } from './investor-page.component';

describe('InvestorPageComponent', () => {
  let component: InvestorPageComponent;
  let fixture: ComponentFixture<InvestorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
