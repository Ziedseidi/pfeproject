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

  selectedFile: File | null = null; // Permet d'accepter 'null' ou 'File'
  message: string = '';

  constructor(private expertService: ExpertService) {}

  // Fonction pour gérer la sélection de fichier
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  // Soumission du formulaire
  onSubmit() {
    console.log('Formulaire envoyé:', this.expert); // Vérifie les données

    if (this.selectedFile) {
      // Si un fichier est sélectionné, on envoie le formulaire avec le fichier
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
      // Si aucun fichier n'est sélectionné
      this.message = 'Veuillez sélectionner une image de profil.';
    }
  }
}
