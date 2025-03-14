import { Component } from '@angular/core';
import { ExpertService } from '../services/expert.service';

@Component({
  selector: 'app-form-expert',
  templateUrl: './form-expert.component.html',
  styleUrls: ['./form-expert.component.css']
})
export class FormExpertComponent {
  expert = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
    imageprofile:'',
    adresse: '',
    dateExpertise: '',
    fraisExpertise: ''
  };

  message: string = '';

  constructor(private expertService: ExpertService) {}

  onSubmit() {
    console.log('Formulaire envoyé:', this.expert);  // Vérifie les données
    this.expertService.registerExpert(this.expert).subscribe({
      next: (response) => {
        this.message = 'Inscription expert  réussie !';
        console.log('✅ Réponse du serveur:', response);
      },
      error: (error) => {
        this.message = 'Erreur lors de l\'inscription';
        console.error('🔥 Erreur API:', error);
      }
    });
  }
}
