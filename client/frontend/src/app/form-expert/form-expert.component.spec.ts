import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExpertComponent } from './form-expert.component';

describe('FormExpertComponent', () => {
  let component: FormExpertComponent;
  let fixture: ComponentFixture<FormExpertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormExpertComponent]
    });
    fixture = TestBed.createComponent(FormExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
