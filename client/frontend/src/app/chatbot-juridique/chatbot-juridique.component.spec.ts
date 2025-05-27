import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotJuridiqueComponent } from './chatbot-juridique.component';

describe('ChatbotJuridiqueComponent', () => {
  let component: ChatbotJuridiqueComponent;
  let fixture: ComponentFixture<ChatbotJuridiqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatbotJuridiqueComponent]
    });
    fixture = TestBed.createComponent(ChatbotJuridiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
