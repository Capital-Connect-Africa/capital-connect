/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViewSpecialCriteriaComponent } from './ViewSpecialCriteria.component';

describe('ViewSpecialCriteriaComponent', () => {
  let component: ViewSpecialCriteriaComponent;
  let fixture: ComponentFixture<ViewSpecialCriteriaComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ViewSpecialCriteriaComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSpecialCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
