import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerConsignationComponent } from './payer-consignation.component';

describe('PayerConsignationComponent', () => {
  let component: PayerConsignationComponent;
  let fixture: ComponentFixture<PayerConsignationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayerConsignationComponent]
    });
    fixture = TestBed.createComponent(PayerConsignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
