import { Component, OnInit } from '@angular/core';
import { AffaireService } from '../services/affaire.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-list-affaires',
  templateUrl: './list-affaires.component.html',
  styleUrls: ['./list-affaires.component.css']
})
export class ListAffairesComponent implements OnInit {
  affaires: any[] = [];
  loading: boolean = false;
  errorMsg: string = '';

  // Variables pour la modale d'assignation
  showModal: boolean = false;
  avocatsEligibles: any[] = [];
  selectedAffaireId: string = '';
  modalLoading: boolean = false;
  modalError: string = '';

  constructor(private affaireService: AffaireService) {}

  ngOnInit(): void {
    this.loadAffaires();
  }

  loadAffaires(): void {
    this.loading = true;
    this.errorMsg = '';
    this.affaireService.getAllAffaires()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: data => this.affaires = data,
        error: _ => this.errorMsg = 'Erreur lors de la récupération des affaires'
      });
  }

  onEdit(affaireId: string): void {
    console.log('Modifier l\'affaire avec ID:', affaireId);
  }

  onDelete(affaireId: string): void {
    console.log('Supprimer l\'affaire avec ID:', affaireId);
  }

  // Méthode pour afficher la modale d'assignation d'un avocat
  onAssign(affaireId: string): void {
    this.selectedAffaireId = affaireId;
    this.modalError = '';
    this.modalLoading = true;
    this.avocatsEligibles = [];

    this.affaireService.getAvocatsEligibles(affaireId)
      .pipe(finalize(() => this.modalLoading = false))
      .subscribe({
        next: (list) => {
          this.avocatsEligibles = list;
          this.showModal = true;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des avocats éligibles :', err);
          this.modalError = 'Impossible de charger les avocats';
        }
      });
  }

  // Méthode pour assigner un avocat à une affaire
  assignerAvocat(utilisateurId: string): void {
    this.modalError = '';  // Réinitialiser l'erreur avant de commencer l'assignation
    this.modalLoading = true;
  
    this.affaireService.assignAvocatToAffaire(utilisateurId, this.selectedAffaireId)
      .pipe(finalize(() => this.modalLoading = false))
      .subscribe({
        next: () => {
          alert('Avocat assigné avec succès 🎉');
          this.fermerModal();
          this.loadAffaires();
        },
        error: err => {
          console.error('Erreur lors de l\'assignation:', err);
          this.modalError = err.message || 'Erreur serveur';  // Afficher le message d'erreur
        }
      });
  }

  // Méthode pour formater la date
  formatDate(date: string): string {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleDateString() : '—';
  }

  fermerModal(): void {
    this.showModal = false;
  }
}
