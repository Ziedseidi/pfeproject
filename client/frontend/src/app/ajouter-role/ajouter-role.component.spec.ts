import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterRoleComponent } from './ajouter-role.component';

describe('AdjouterRoleComponent', () => {
  let component: AjouterRoleComponent;
  let fixture: ComponentFixture<AjouterRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterRoleComponent]
    });
    fixture = TestBed.createComponent(AjouterRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
