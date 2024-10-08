/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DebouncedSearchComponent } from './debounced-search.component';

describe('DebouncedSearchComponent', () => {
  let component: DebouncedSearchComponent;
  let fixture: ComponentFixture<DebouncedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebouncedSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebouncedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
