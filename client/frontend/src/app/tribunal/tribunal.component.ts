import { Component } from '@angular/core';
import { TribunalService } from '../services/tribunal.service';

@Component({
  selector: 'app-tribunal',
  templateUrl: './tribunal.component.html',
  styleUrls: ['./tribunal.component.css'],
})
export class TribunalComponent {
  isModalOpen: boolean = true;  // Contrôle l'état du modal
  tribunalData = {
    nom: '',
    adresse: '',
    ville: '',
    telephone: '',
    email: '',
    typeTribunal: '',
    etatTribunal: true,
    imageTribunal: null as File | null,
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;
  selectedFile: File | null = null;

  constructor(private tribunalService: TribunalService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    this.tribunalData.imageTribunal = this.selectedFile;

    this.tribunalService.addTribunal(this.tribunalData, this.selectedFile).subscribe({
      next: (response) => {
        this.successMessage = 'Tribunal ajouté avec succès !';
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'ajout du tribunal';
        this.successMessage = null;
      },
    });
  }

  // Fermer la fenêtre modale
  closeModal() {
    this.isModalOpen = false;
  }
}
