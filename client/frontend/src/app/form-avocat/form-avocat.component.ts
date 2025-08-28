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
    imageprofile: null,
    adresse: '',
    honoraires: 0,
    region: '',
    degreJuridiction: ''  // Ajout du champ "degreJuridiction"
  };

  message: string = '';

  constructor(private avocatService: AvocatService) {}

  onFileSelected(event: any) {
    this.avocat.imageprofile = event.target.files[0];
  }

  onSubmit() {
    if (this.avocat.imageprofile) {
      console.log('Formulaire envoyé:', this.avocat);
      this.avocatService.registerAvocat(this.avocat, this.avocat.imageprofile).subscribe({
        next: (response) => {
          this.message = 'Inscription avocat réussie !';
          console.log("✅ Réponse du serveur:", response);
        },
        error: (error) => {
          this.message = 'Email déja existe !!!!';
          console.error("🔥 Erreur API:", error);
        }
      });
    } else {
      this.message = 'Veuillez sélectionner une image de profil.';
    }
  }
}
