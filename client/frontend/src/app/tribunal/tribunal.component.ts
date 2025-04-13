import { Component } from '@angular/core';
import { TribunalService } from '../services/tribunal.service'; // Assurez-vous que le service existe

@Component({
  selector: 'app-tribunal',
  templateUrl: './tribunal.component.html',
  styleUrls: ['./tribunal.component.css'],
})
export class TribunalComponent {
  tribunalData = {
    nom: '',
    adresse: '',
    ville: '',
    telephone: '',
    email: '',
    typeTribunal: '',
    etatTribunal: true,  // Par défaut en travail
    imageTribunal: null as File | null,  // Ajuster le type ici
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;
  selectedFile: File | null = null;  // Déclaration correcte pour gérer le fichier sélectionné

  constructor(private tribunalService: TribunalService) {}

  // Pour gérer l'image sélectionnée
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;  // Stocker le fichier sélectionné dans selectedFile
    }
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    // Assigner l'image sélectionnée à l'objet tribunalData
    this.tribunalData.imageTribunal = this.selectedFile;  // Peut être null ou un fichier

    // Soumettre le formulaire avec ou sans image
    console.log('Formulaire envoyé:', this.tribunalData);
    
    // Vérifier si une image est présente ou non
    const imageToSend = this.selectedFile ? this.selectedFile : null;

    this.tribunalService.addTribunal(this.tribunalData, imageToSend).subscribe({
      next: (response) => {
        this.successMessage = 'Tribunal ajouté avec succès !';
        this.errorMessage = null;
        console.log("✅ Réponse du serveur:", response);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'ajout du tribunal';
        this.successMessage = null;
        console.error("🔥 Erreur API:", error);
      },
    });
  }
}
