import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganiserPage } from './organiser.page';

describe('OrganiserPage', () => {
  let component: OrganiserPage;
  let fixture: ComponentFixture<OrganiserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganiserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganiserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
