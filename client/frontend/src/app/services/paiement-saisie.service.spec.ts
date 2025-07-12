import { TestBed } from '@angular/core/testing';

import { PaiementSaisieService } from './paiement-saisie.service';

describe('PaiementSaisieService', () => {
  let service: PaiementSaisieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaiementSaisieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
