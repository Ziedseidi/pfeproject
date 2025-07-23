import { Component, OnInit } from '@angular/core';
import { ChatbotJuridiqueService } from '../services/chatbot-juridique.service';

@Component({
  selector: 'app-chatbot-juridique',
  templateUrl: './chatbot-juridique.component.html',
  styleUrls: ['./chatbot-juridique.component.css']
})
export class ChatbotJuridiqueComponent implements OnInit {
  question: string = '';
  loading: boolean = false;
  erreur: string = '';

  messages: { text: string, type: 'user' | 'bot' | 'error', time?: Date }[] = [];

  isMinimized: boolean = false;  // État de minimisation
  isClosed: boolean = false;     // État de fermeture

  constructor(private chatbotService: ChatbotJuridiqueService) {}

  ngOnInit() {
    this.messages.push({
      text: "Bienvenue, en quoi pouvons-nous vous aider ?",
      type: 'bot',
      time: new Date()
    });
  }

  poserQuestion() {
    if (!this.question.trim()) {
      this.erreur = "Veuillez saisir une question.";
      this.messages.push({ 
        text: this.erreur, 
        type: 'error',
        time: new Date()
      });
      return;
    }

    this.loading = true;
    this.messages.push({ 
      text: this.question, 
      type: 'user',
      time: new Date()
    });

    const currentQuestion = this.question;
    this.question = '';

    this.chatbotService.getAnswer(currentQuestion).subscribe({
      next: (data) => {
        this.loading = false;
        this.animateText(data.réponse);
      },
      error: (err) => {
        this.loading = false;
        this.messages.push({ 
          text: "Erreur lors de la récupération de la réponse.", 
          type: 'error',
          time: new Date()
        });
      }
    });
  }

  animateText(fullText: string) {
    const words = fullText.split(' ');
    let index = 0;

    this.messages.push({ 
      text: '', 
      type: 'bot',
      time: new Date()
    });

    const messageIndex = this.messages.length - 1;
    const interval = setInterval(() => {
      if (index < words.length) {
        this.messages[messageIndex].text += (index === 0 ? '' : ' ') + words[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  // Méthode pour minimiser ou restaurer le chatbot
  minimiserChat() {
    this.isMinimized = !this.isMinimized;
  }

  // Méthode pour fermer complètement le chatbot
  fermerChat() {
    this.isClosed = true;
  }
}
