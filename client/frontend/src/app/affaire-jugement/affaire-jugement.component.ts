import { Component, OnInit } from '@angular/core';
import { AffaireService } from '../services/affaire.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-affaire-jugement',
  templateUrl: './affaire-jugement.component.html',
  styleUrls: ['./affaire-jugement.component.css']
})
export class AffaireJugementComponent implements OnInit {
  numeroAffaire: string = '';
  affaireId: string = '';
  affaire: any;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Champs pour le jugement
  dateJugement: string = '';
  montant: number | null = null;
  issue: string = '';
  remarque: string = '';

  constructor(private affaireService: AffaireService, private router: Router) {}

  ngOnInit(): void {}

  onSearch(): void {
    if (!this.numeroAffaire) return;

    this.affaireService.rechercherAffaireParNumero(this.numeroAffaire).subscribe({
      next: (data) => {
        this.affaire = data;
        this.affaireId = data._id;
        this.errorMessage = null;
      },
      error: (err) => {
        this.affaire = null;
        this.errorMessage = 'Erreur lors de la recherche de l\'affaire.';
        console.error(err);
      }
    });
  }

  assignerJugement(): void {
    if (!this.affaireId) {
      this.errorMessage = 'Aucune affaire sélectionnée.';
      return;
    }

    const jugementData = {
      affaireId: this.affaireId,
      dateJugement: this.dateJugement,
      montant: this.montant!,
      issue: this.issue,
      remarque: this.remarque
    };

    this.affaireService.assignerJugement(jugementData).subscribe({
      next: (res) => {
        this.successMessage = 'Jugement affecté avec succès.';
        this.errorMessage = null;
      },
      error: (err) => {
        this.successMessage = null;
        this.errorMessage = 'Erreur lors de l\'affectation du jugement.';
        console.error(err);
      }
    });
  }
}
