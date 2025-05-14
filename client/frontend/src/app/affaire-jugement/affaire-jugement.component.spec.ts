import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffaireJugementComponent } from './affaire-jugement.component';

describe('AffaireJugementComponent', () => {
  let component: AffaireJugementComponent;
  let fixture: ComponentFixture<AffaireJugementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffaireJugementComponent]
    });
    fixture = TestBed.createComponent(AffaireJugementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
