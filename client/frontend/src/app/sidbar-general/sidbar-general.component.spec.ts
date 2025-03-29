import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidbarGeneralComponent } from './sidbar-general.component';

describe('SidbarGeneralComponent', () => {
  let component: SidbarGeneralComponent;
  let fixture: ComponentFixture<SidbarGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidbarGeneralComponent]
    });
    fixture = TestBed.createComponent(SidbarGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
