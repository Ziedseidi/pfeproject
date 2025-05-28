import { Component, OnInit } from '@angular/core';
import { ChatbotJuridiqueService } from '../services/chatbot-juridique.service';

@Component({
  selector: 'app-chatbot-juridique',
  templateUrl: './chatbot-juridique.component.html',
  styleUrls: ['./chatbot-juridique.component.css']
})
export class ChatbotJuridiqueComponent implements OnInit{
  question: string = '';
  loading: boolean = false;
  erreur: string = '';

  messages: { text: string, type: 'user' | 'bot' | 'error' }[] = [];

  constructor(private chatbotService: ChatbotJuridiqueService) {}
 ngOnInit() {
    this.messages.push({
      text: "Bienvenue, en quoi pouvons-nous vous aider ?",
      type: 'bot'
    });
  }


  poserQuestion() {
    if (!this.question.trim()) {
      this.erreur = "Veuillez saisir une question.";
      this.messages.push({ text: this.erreur, type: 'error' });
      return;
    }

    this.loading = true;
    this.erreur = '';
    this.messages.push({ text: this.question, type: 'user' });

    this.chatbotService.getAnswer(this.question).subscribe({
      next: (data) => {
        this.loading = false;
        this.question = '';

        // Effet machine à écrire mot par mot
        this.animateText(data.réponse);
      },
      error: (err) => {
        this.erreur = "Erreur lors de la récupération de la réponse.";
        this.messages.push({ text: this.erreur, type: 'error' });
        this.loading = false;
      }
    });
  }

  animateText(fullText: string) {
    const words = fullText.split(' ');
    let index = 0;

    // Ajoute un message bot vide au début
    this.messages.push({ text: '', type: 'bot' });

    const interval = setInterval(() => {
      if (index < words.length) {
        // Ajoute un mot à la fin du dernier message
        this.messages[this.messages.length - 1].text += (index === 0 ? '' : ' ') + words[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, 200);  // 200ms entre chaque mot, ajuste à ta vitesse préférée
  }
}
