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
    imageprofile:'',
    adresse: '',
    honoraires: 0,
    region: '',
    referenceConvention: '',
    dateDebutConvention: '',
    dateFinConvention: ''
  };

  message: string = '';

  constructor(private avocatService: AvocatService) {}

  onSubmit() {
    console.log('Formulaire envoyé:', this.avocat);  // Vérifie les données
    this.avocatService.registerAvocat(this.avocat).subscribe({
      next: (response) => {
        this.message = 'Inscription avocat réussie !';
        console.log("✅ Réponse du serveur:", response);
      },
      error: (error) => {
        this.message = 'Erreur lors de l\'inscription d\'avocat';
        console.error("🔥 Erreur API:", error);
      }
    });
  }
}
