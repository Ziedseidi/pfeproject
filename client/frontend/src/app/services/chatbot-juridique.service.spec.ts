import { TestBed } from '@angular/core/testing';

import { ChatbotJuridiqueService } from './chatbot-juridique.service';

describe('ChatbotJuridiqueService', () => {
  let service: ChatbotJuridiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotJuridiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
