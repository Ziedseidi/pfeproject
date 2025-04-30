// recherche-affaire.component.ts
import { Component } from '@angular/core';
import { AffaireService } from '../services/affaire.service'; // Assure-toi du bon chemin du service

@Component({
  selector: 'app-recherche-affaire',
  templateUrl: './recherche-affaire.component.html',
  styleUrls: ['./recherche-affaire.component.css']
})
export class RechercheAffaireComponent {
  numeroAffaire: string = ''; // Le numéro d'affaire entré par l'utilisateur
  affaire: any = null; // L'affaire à afficher après la recherche
  loading: boolean = false; // Indicateur de chargement
  errorMessage: string = ''; // Message d'erreur s'il y en a

  constructor(private affaireService: AffaireService) {}

  // Fonction pour rechercher une affaire par son numeroAffaire
  rechercherAffaire() {
    if (!this.numeroAffaire) {
      this.errorMessage = 'Veuillez entrer un numéro d\'affaire.';
      return;
    }

    this.loading = true;
    this.errorMessage = ''; // Réinitialiser le message d'erreur

    this.affaireService.rechercherAffaireParNumero(this.numeroAffaire).subscribe(
      (affaire) => {
        this.loading = false;

        if (affaire) {
          this.affaire = affaire; // Afficher l'affaire
        } else {
          this.errorMessage = 'Aucune affaire trouvée pour ce numéro.';
        }
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de la recherche de l\'affaire.';
      }
    );
  }
}
