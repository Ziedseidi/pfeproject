import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieAffaireComponent } from './saisie-affaire.component';

describe('SaisieAffaireComponent', () => {
  let component: SaisieAffaireComponent;
  let fixture: ComponentFixture<SaisieAffaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaisieAffaireComponent]
    });
    fixture = TestBed.createComponent(SaisieAffaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
