import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratPdfComponent } from './contrat-pdf.component';

describe('ContratPdfComponent', () => {
  let component: ContratPdfComponent;
  let fixture: ComponentFixture<ContratPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContratPdfComponent]
    });
    fixture = TestBed.createComponent(ContratPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
