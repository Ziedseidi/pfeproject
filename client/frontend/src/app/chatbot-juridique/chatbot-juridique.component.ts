import { Component } from '@angular/core';
import { ChatbotJuridiqueService } from '../services/chatbot-juridique.service';

@Component({
  selector: 'app-chatbot-juridique',
  templateUrl: './chatbot-juridique.component.html',
  styleUrls: ['./chatbot-juridique.component.css']
})
export class ChatbotJuridiqueComponent {
  question: string = '';
  reponse: string = '';
  loading: boolean = false;
  erreur: string = '';

  constructor(private chatbotService: ChatbotJuridiqueService) {}

  poserQuestion() {
    if (!this.question.trim()) {
      this.erreur = "Veuillez saisir une question.";
      return;
    }

    this.loading = true;
    this.erreur = '';
    this.reponse = '';

    this.chatbotService.getAnswer(this.question).subscribe({
      next: (data) => {
        this.reponse = data.réponse;
        this.loading = false;
      },
      error: (err) => {
        this.erreur = "Erreur lors de la récupération de la réponse.";
        this.loading = false;
      }
    });
  }
}
