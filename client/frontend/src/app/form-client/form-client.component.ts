import { Component } from '@angular/core';
import { DemandeurService } from '../services/demandeur.service';

@Component({
  selector: 'app-form-client',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.css']
})
export class FormClientComponent {
  demandeur = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
    cin: '',
    matricule: '',
    ficheCarriere: '',
    contratTravail: '',
    decisionsPromotions: '',
    imageprofile: '' // on n'utilise plus ngModel ici pour l'image
  };

  selectedFile: File | null = null; // pour stocker le fichier sélectionné
  message: string = '';

  constructor(private demandeurService: DemandeurService) {}

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

    console.log('Formulaire envoyé:', this.demandeur);  // Log les données
    this.demandeurService.registerDemandeur(this.demandeur, this.selectedFile).subscribe({
      next: (response) => {
        this.message = 'Inscription demandeur réussie !';
        console.log("✅ Réponse du serveur:", response);
      },
      error: (error) => {
        this.message = 'Erreur lors de l\'inscription';
        console.error("🔥 Erreur API:", error);
      }
    });
  }
}
