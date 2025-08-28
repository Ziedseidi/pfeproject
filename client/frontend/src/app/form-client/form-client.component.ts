import { Component } from '@angular/core';
import { DemandeurService } from '../services/demandeur.service';

@Component({
  selector: 'app-form-client',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.css']
})
export class FormClientComponent {
  demandeur: any = {};
  message = '';

  constructor(private demandeurService: DemandeurService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.demandeur.imageprofile = file;
      console.log("✅ Fichier sélectionné:", file);
    }
  }

  onSubmit() {
    if (this.demandeur.imageprofile) {
      console.log('✅ Formulaire envoyé:', this.demandeur);
      this.demandeurService.registerDemandeur(this.demandeur, this.demandeur.imageprofile).subscribe({
        next: (response) => {
          this.message = 'Inscription demandeur réussie !';
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
