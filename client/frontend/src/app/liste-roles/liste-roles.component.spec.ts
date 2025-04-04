import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRolesComponent } from './liste-roles.component';

describe('ListeRolesComponent', () => {
  let component: ListeRolesComponent;
  let fixture: ComponentFixture<ListeRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeRolesComponent]
    });
    fixture = TestBed.createComponent(ListeRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
