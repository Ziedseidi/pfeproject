import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeUtilisateursComponent } from './liste-utilisateurs.component';
describe('UsersListComponent', () => {
  let component: ListeUtilisateursComponent;
  let fixture: ComponentFixture<ListeUtilisateursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeUtilisateursComponent]
    });
    fixture = TestBed.createComponent(ListeUtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
