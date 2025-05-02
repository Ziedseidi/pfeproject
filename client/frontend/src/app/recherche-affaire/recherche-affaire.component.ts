import { Component } from '@angular/core';
import { AffaireService } from '../services/affaire.service';
import { ChangeDetectorRef } from '@angular/core';  // Importer ChangeDetectorRef

@Component({
  selector: 'app-recherche-affaire',
  templateUrl: './recherche-affaire.component.html',
  styleUrls: ['./recherche-affaire.component.css']
})
export class RechercheAffaireComponent {
  numeroAffaire: string = ''; 
  affaire: any = null; 
  tribunauxCompatibles: any[] = []; 
  selectedTribunalId: string | null = null; 
  loading: boolean = false; 
  errorMessage: string = ''; 
  successMessage: string = ''; 
  tribunalDejaAssigne: boolean = false;

  constructor(private affaireService: AffaireService, private cdr: ChangeDetectorRef) {}

  rechercherAffaire() {
    if (!this.numeroAffaire) {
      this.errorMessage = 'Veuillez entrer un numéro d\'affaire.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = ''; 
    this.affaire = null;
    this.tribunauxCompatibles = [];
    this.tribunalDejaAssigne = false;

    this.affaireService.rechercherAffaireParNumero(this.numeroAffaire).subscribe(
      (affaire) => {
        this.loading = false;

        if (affaire) {
          this.affaire = affaire;

          if (this.affaire.tribunal && this.affaire.tribunal.nom) {
            this.tribunalDejaAssigne = true;
          } else {
            this.tribunalDejaAssigne = false;

            this.affaireService.getTribunauxCompatibles(affaire._id).subscribe(
              (tribunaux) => {
                this.tribunauxCompatibles = tribunaux;
              },
              (err) => {
                console.error('Erreur récupération tribunaux compatibles :', err);
                this.errorMessage = 'Erreur lors de la récupération des tribunaux compatibles.';
              }
            );
          }

        } else {
          this.errorMessage = 'Aucune affaire trouvée pour ce numéro.';
        }
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Aucune affaire trouvée pour ce numéro.';
      }
    );
  }

  assignTribunal() {
    if (!this.selectedTribunalId) {
      this.errorMessage = 'Veuillez sélectionner un tribunal.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.affaireService.assignTribunalToAffaire(
      this.affaire.avocat?._id,
      this.affaire._id,
      this.selectedTribunalId
    ).subscribe(
      (response) => {
        this.loading = false;
        this.successMessage = 'Tribunal assigné avec succès';

        // Mettez à jour l'affaire avec le tribunal assigné
        this.affaire.tribunal = response.tribunal;
        this.tribunalDejaAssigne = true;

        // Déclencher manuellement la détection des changements pour s'assurer que la vue est mise à jour
        this.cdr.detectChanges();  // Force la détection des changements

      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de l\'assignation du tribunal.';
      }
    );
  }
}
