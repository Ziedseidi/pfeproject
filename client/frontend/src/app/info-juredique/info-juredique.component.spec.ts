import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoJurediqueComponent } from './info-juredique.component';

describe('InfoJurediqueComponent', () => {
  let component: InfoJurediqueComponent;
  let fixture: ComponentFixture<InfoJurediqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoJurediqueComponent]
    });
    fixture = TestBed.createComponent(InfoJurediqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
