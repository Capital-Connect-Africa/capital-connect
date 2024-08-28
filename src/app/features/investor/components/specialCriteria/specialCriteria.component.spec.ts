/* tslint:disable:no-unused-variable */
import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpecialCriteriaComponent } from './specialCriteria.component';

describe('SpecialCriteriaComponent', () => {
  let component: SpecialCriteriaComponent;
  let fixture: ComponentFixture<SpecialCriteriaComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SpecialCriteriaComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
