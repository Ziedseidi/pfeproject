import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheAffaireComponent } from './recherche-affaire.component';

describe('RechercheAffaireComponent', () => {
  let component: RechercheAffaireComponent;
  let fixture: ComponentFixture<RechercheAffaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RechercheAffaireComponent]
    });
    fixture = TestBed.createComponent(RechercheAffaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
