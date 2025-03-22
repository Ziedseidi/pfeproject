import { Component } from '@angular/core';
import { clientService } from '../services/client.service';

@Component({
  selector: 'app-client-avocat',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.css']
})
export class FormClientComponent {
  client = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
    imageprofile: '' // on n'utilise plus ngModel ici pour l'image
  };

  selectedFile: File | null = null; // pour stocker le fichier sélectionné
  message: string = '';

  constructor(private clientService: clientService) {}

  // Méthode pour capturer le fichier sélectionné
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("Fichier sélectionné:", file); // Pour déboguer
    }
  }

  // Méthode d'envoi du formulaire
  onSubmit() {
    if (!this.selectedFile) {
      this.message = 'Veuillez sélectionner une image de profil.';
      return;
    }

    console.log('Formulaire envoyé:', this.client);  // Log les données
    this.clientService.registerClient(this.client, this.selectedFile).subscribe({
      next: (response) => {
        this.message = 'Inscription client  réussie !';
        console.log("✅ Réponse du serveur:", response);
      },
      error: (error) => {
        this.message = 'Erreur lors de l\'inscription';
        console.error("🔥 Erreur API:", error);
      }
    });
  }
}
