import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesignupPage } from './profilesignup.page';

describe('ProfilesignupPage', () => {
  let component: ProfilesignupPage;
  let fixture: ComponentFixture<ProfilesignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesignupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
