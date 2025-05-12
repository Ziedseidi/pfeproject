import { Component } from '@angular/core';
import { DossierService, Dossier } from '../services/dossier.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dossier-detail',
  templateUrl: './dossier-detail.component.html',
  styleUrls: ['./dossier-detail.component.css']
})
export class DossierDetailComponent {
  isImageOpen: boolean = false;

  // Image sélectionnée à afficher
  selectedImage: string = '';
  dossier: Dossier | null = null; // Variable pour stocker le dossier
  errorMessage: string = ''; // Variable pour afficher les erreurs

  constructor(
    private dossierService: DossierService,
    private route: ActivatedRoute // Pour récupérer l'ID du dossier dans l'URL
  ) {}

  ngOnInit(): void {
    const dossierId = this.route.snapshot.paramMap.get('id');
    if (dossierId) {
      this.getDossierById(dossierId); 
    }
  }

  getDossierById(id: string): void {
    this.dossierService.getDossierById(id).subscribe({
      next: (dossier: Dossier) => {
        this.dossier = dossier; // Assignation des détails du dossier
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération du dossier'; // Gestion des erreurs
        console.error('Erreur lors de la récupération du dossier :', err);
      }
    });
  }
  openImage(image: string): void {
    this.selectedImage = image;
    this.isImageOpen = true;
  }

  // Fonction pour fermer la modale
  closeImage(): void {
    this.isImageOpen = false;
  }
}
