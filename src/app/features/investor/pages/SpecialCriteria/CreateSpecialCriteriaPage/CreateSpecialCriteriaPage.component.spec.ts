/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateSpecialCriteriaPageComponent } from './CreateSpecialCriteriaPage.component';

describe('CreateSpecialCriteriaPageComponent', () => {
  let component: CreateSpecialCriteriaPageComponent;
  let fixture: ComponentFixture<CreateSpecialCriteriaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSpecialCriteriaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSpecialCriteriaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
