import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerSaisieComponent } from './payer-saisie.component';

describe('PayerSaisieComponent', () => {
  let component: PayerSaisieComponent;
  let fixture: ComponentFixture<PayerSaisieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayerSaisieComponent]
    });
    fixture = TestBed.createComponent(PayerSaisieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
