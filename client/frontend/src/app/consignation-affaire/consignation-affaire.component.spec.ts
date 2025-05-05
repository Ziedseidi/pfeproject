import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignationAffaireComponent } from './consignation-affaire.component';

describe('ConsignationAffaireComponent', () => {
  let component: ConsignationAffaireComponent;
  let fixture: ComponentFixture<ConsignationAffaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsignationAffaireComponent]
    });
    fixture = TestBed.createComponent(ConsignationAffaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
