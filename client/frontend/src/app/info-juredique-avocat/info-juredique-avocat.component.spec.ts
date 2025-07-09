import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoJurediqueAvocatComponent } from './info-juredique-avocat.component';

describe('InfoJurediqueAvocatComponent', () => {
  let component: InfoJurediqueAvocatComponent;
  let fixture: ComponentFixture<InfoJurediqueAvocatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoJurediqueAvocatComponent]
    });
    fixture = TestBed.createComponent(InfoJurediqueAvocatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
