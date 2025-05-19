import { Component } from '@angular/core';
import { AffaireService } from '../services/affaire.service'; // Assurez-vous d'importer le service correctement
import { Router } from '@angular/router';

@Component({
  selector: 'app-saisie-affaire',
  templateUrl: './saisie-affaire.component.html',
  styleUrls: ['./saisie-affaire.component.css']
})
export class SaisieAffaireComponent {
  numeroAffaire: string = ''; 
  affaireId: string = ''; 
  objetsSaisis: string = ''; 
  dateAudience: string = ''; 
  numeroSaisie: number | null = null; // Numéro de saisie
  nomAdverse: string = ''; // Nom adverse
  numeroPV: number | null = null; // Numéro du procès-verbal
  montantSaisi: number | null = null; // Montant saisi

  affaire: any; // Variable pour stocker les données de l'affaire trouvée
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private affaireService: AffaireService, private router: Router) {}

  
  onSearch(): void {
    if (!this.numeroAffaire) {
      return; 
    }
  
    this.affaireService.rechercherAffaireParNumero(this.numeroAffaire).subscribe(
      (data) => {
        this.affaire = data; 
        this.affaireId = this.affaire._id; // Assigner l'ID de l'affaire trouvée
        this.errorMessage = null; // Réinitialiser le message d'erreur si succès
      },
      (error) => {
        this.affaire = null; // Réinitialiser l'affaire si erreur
        this.errorMessage = 'Erreur lors de la recherche de l\'affaire.'; // Afficher message d'erreur
        console.error('Erreur recherche affaire :', error);
      }
    );
  }

  // Fonction d'assignation de saisie à l'affaire
  assignSaisie(): void {
    // Vérification que tous les champs nécessaires sont remplis
    if (this.affaireId && this.objetsSaisis && this.dateAudience && this.numeroSaisie && this.nomAdverse && this.numeroPV && this.montantSaisi) {
      this.affaireService.assignSaisieToAffaire(
        this.affaireId,
        this.objetsSaisis,
        this.dateAudience,
        this.numeroSaisie,
        this.nomAdverse,
        this.numeroPV,
        this.montantSaisi
      ).subscribe(
        (response) => {
          this.successMessage = 'Saisie assignée avec succès !'; // Afficher le message de succès
          this.errorMessage = null; // Réinitialiser le message d'erreur
        },
        (error) => {
          this.errorMessage = error.message || 'Une erreur est survenue lors de l\'assignation de la saisie.'; // Afficher message d'erreur
          this.successMessage = null; // Réinitialiser le message de succès
        }
      );
    } else {
      this.errorMessage = 'Tous les champs doivent être remplis.'; 
    }
  }
}