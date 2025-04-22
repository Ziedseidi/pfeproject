import { Component, OnInit } from '@angular/core';
import { AffaireService } from '../services/affaire.service';  // Importation du service

@Component({
  selector: 'app-list-affaires',
  templateUrl: './list-affaires.component.html',
  styleUrls: ['./list-affaires.component.css']
})
export class ListAffairesComponent implements OnInit {
  affaires: any[] = [];  // Tableau pour stocker les affaires récupérées
  loading: boolean = false;  // Variable pour indiquer si les données sont en cours de chargement
  errorMsg: string = '';  // Message d'erreur en cas de problème

  constructor(private affaireService: AffaireService) {}

  // Méthode pour récupérer les affaires au chargement du composant
  ngOnInit(): void {
    this.loadAffaires();
  }

  // Fonction pour charger les affaires
  loadAffaires(): void {
    this.loading = true;  // On commence à charger les affaires
    this.affaireService.getAllAffaires().subscribe({
      next: (data) => {
        this.affaires = data;  // On assigne les données récupérées à la variable affaires
        this.loading = false;  // On arrête le chargement
      },
      error: (err) => {
        this.errorMsg = 'Erreur lors de la récupération des affaires';  // En cas d'erreur
        this.loading = false;  // On arrête le chargement
      }
    });
  }

  // Méthode pour modifier une affaire
  onEdit(affaireId: string): void {
    console.log('Modifier l\'affaire avec ID:', affaireId);
    // Vous pouvez rediriger vers une page de modification ou ouvrir un formulaire
  }

  // Méthode pour supprimer une affaire
  onDelete(affaireId: string): void {
    console.log('Supprimer l\'affaire avec ID:', affaireId);
    // Vous pouvez appeler une méthode pour supprimer l'affaire via le service
  }

  // Méthode pour assigner une affaire
  onAssign(affaireId: string): void {
    console.log('Assigner l\'affaire avec ID:', affaireId);
    // Vous pouvez ouvrir une modale pour assigner un avocat ou un expert à l'affaire
  }
}
