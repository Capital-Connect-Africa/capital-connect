/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViewSPecialCriteriaPageComponent } from './ViewSPecialCriteriaPage.component';

describe('ViewSPecialCriteriaPageComponent', () => {
  let component: ViewSPecialCriteriaPageComponent;
  let fixture: ComponentFixture<ViewSPecialCriteriaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSPecialCriteriaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSPecialCriteriaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
