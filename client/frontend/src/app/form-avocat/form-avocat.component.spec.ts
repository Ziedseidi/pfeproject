import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAvocatComponent } from './form-avocat.component';

describe('FormAvocatComponent', () => {
  let component: FormAvocatComponent;
  let fixture: ComponentFixture<FormAvocatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormAvocatComponent]
    });
    fixture = TestBed.createComponent(FormAvocatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
