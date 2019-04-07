import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeHomePage } from './qrcode-home.page';

describe('QrcodeHomePage', () => {
  let component: QrcodeHomePage;
  let fixture: ComponentFixture<QrcodeHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodeHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
