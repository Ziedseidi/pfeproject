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
    imageprofile:'',
    
  };

  message: string = '';

  constructor(private clientService: clientService) {}

  onSubmit() {
    console.log('Formulaire envoyé:', this.client);  // Vérifie les données
    this.clientService.registerClient(this.client
    ).subscribe({
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
