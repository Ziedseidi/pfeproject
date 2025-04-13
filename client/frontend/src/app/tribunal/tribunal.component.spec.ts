import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TribunalComponent } from './tribunal.component';

describe('TribunalComponent', () => {
  let component: TribunalComponent;
  let fixture: ComponentFixture<TribunalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TribunalComponent]
    });
    fixture = TestBed.createComponent(TribunalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
