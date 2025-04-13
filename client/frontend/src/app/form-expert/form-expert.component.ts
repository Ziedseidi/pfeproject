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
    imageprofile: '',
    adresse: '',
    dateExpertise: '',
    fraisExpertise: ''
  };

  selectedFile: File | null = null; 
  message: string = '';

  constructor(private expertService: ExpertService) {}

  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    console.log('Formulaire envoyé:', this.expert); 

    if (this.selectedFile) {
      this.expertService.registerExpert(this.expert, this.selectedFile).subscribe({
        next: (response) => {
          this.message = 'Inscription expert réussie !';
          console.log('✅ Réponse du serveur:', response);
        },
        error: (error) => {
          this.message = 'Erreur lors de l\'inscription';
          console.error('🔥 Erreur API:', error);
        }
      });
    } else {
      
      this.message = 'Veuillez sélectionner une image de profil.';
    }
  }
}
