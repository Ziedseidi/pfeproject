import { Component } from '@angular/core';
import { AffaireService } from '../services/affaire.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consignation-affaire',
  templateUrl: './consignation-affaire.component.html',
  styleUrls: ['./consignation-affaire.component.css']
})
export class ConsignationAffaireComponent {
  numeroAffaire: string = '';
  affaire: any = null;
  montantConsignation: number | null = null;
  dateConsignation: string = '';
  errorMessage: string = '';
  successMessage: string = ''; // Variable pour gérer le message de succès

  constructor(private affaireService: AffaireService, private router: Router) {}

  onSearch(): void {
    if (!this.numeroAffaire) return;

    this.affaireService.rechercherAffaireParNumero(this.numeroAffaire).subscribe(
      (data) => {
        this.affaire = data;
        this.errorMessage = '';
      },
      (error) => {
        this.affaire = null;
        this.errorMessage = 'Erreur lors de la recherche de l\'affaire.';
        console.error('Erreur recherche affaire :', error);
      }
    );
  }

  onAssignConsignation(): void {
    if (this.montantConsignation === null || !this.dateConsignation) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    if (!this.affaire || !this.affaire._id) {
      this.errorMessage = 'Aucune affaire sélectionnée ou ID invalide.';
      return;
    }

    this.affaireService.assignConsignationToAffaire(
      this.affaire._id, // <-- ID de l'affaire
      this.montantConsignation,
      this.dateConsignation
    ).subscribe(
      (response) => {
        // Afficher le message de succès
        this.successMessage = 'Consignation assignée avec succès !';
        this.montantConsignation = null;
        this.dateConsignation = '';
        this.errorMessage = '';

        // Optionnel : Effacer le message de succès après 3 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      (error) => {
        console.error('Erreur consignation :', error);
        this.errorMessage = error.error?.message || 'Erreur lors de l\'assignation de la consignation.';
      }
    );
  }
}
