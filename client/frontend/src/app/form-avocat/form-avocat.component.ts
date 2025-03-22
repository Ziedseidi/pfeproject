import { Component } from '@angular/core';
import { AvocatService } from '../services/avocat.service';

@Component({
  selector: 'app-form-avocat',
  templateUrl: './form-avocat.component.html',
  styleUrls: ['./form-avocat.component.css']
})
export class FormAvocatComponent {
  avocat = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
    imageprofile: null,  // L'image sera stockée ici
    adresse: '',
    honoraires: 0,
    region: '',
    referenceConvention: '',
    dateDebutConvention: '',
    dateFinConvention: ''
  };

  message: string = '';

  constructor(private avocatService: AvocatService) {}

  // Méthode pour récupérer l'image sélectionnée et l'ajouter au formData
  onFileSelected(event: any) {
    this.avocat.imageprofile = event.target.files[0];  // Récupère le fichier image
  }

  // Méthode pour envoyer les données du formulaire et l'image
  onSubmit() {
    if (this.avocat.imageprofile) {
      // Si l'image est sélectionnée, on envoie le formulaire
      console.log('Formulaire envoyé:', this.avocat);
      this.avocatService.registerAvocat(this.avocat, this.avocat.imageprofile).subscribe({
        next: (response) => {
          this.message = 'Inscription avocat réussie !';
          console.log("✅ Réponse du serveur:", response);
        },
        error: (error) => {
          this.message = 'Erreur lors de l\'inscription de l\'avocat';
          console.error("🔥 Erreur API:", error);
        }
      });
    } else {
      this.message = 'Veuillez sélectionner une image de profil.';
    }
  }
}
