import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvocatDashboardComponent } from './avocat-dashboard.component';

describe('AvocatDashboardComponent', () => {
  let component: AvocatDashboardComponent;
  let fixture: ComponentFixture<AvocatDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvocatDashboardComponent]
    });
    fixture = TestBed.createComponent(AvocatDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
