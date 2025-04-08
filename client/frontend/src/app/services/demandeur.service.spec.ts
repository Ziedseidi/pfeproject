import { TestBed } from '@angular/core/testing';

import { DemandeurService } from './demandeur.service';

describe('DemandeurService', () => {
  let service: DemandeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
