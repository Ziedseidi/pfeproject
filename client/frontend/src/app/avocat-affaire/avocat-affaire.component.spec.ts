import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvocatAffaireComponent } from './avocat-affaire.component';

describe('AvocatAffaireComponent', () => {
  let component: AvocatAffaireComponent;
  let fixture: ComponentFixture<AvocatAffaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvocatAffaireComponent]
    });
    fixture = TestBed.createComponent(AvocatAffaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
