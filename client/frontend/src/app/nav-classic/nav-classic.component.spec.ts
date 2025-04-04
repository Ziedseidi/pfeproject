import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavClassicComponent } from './nav-classic.component';

describe('NavClassicComponent', () => {
  let component: NavClassicComponent;
  let fixture: ComponentFixture<NavClassicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavClassicComponent]
    });
    fixture = TestBed.createComponent(NavClassicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
