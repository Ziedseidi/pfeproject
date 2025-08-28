import { Component, OnInit } from '@angular/core';
import { TribunalService } from 'src/app/services/tribunal.service';

@Component({
  selector: 'app-tribunal-list',
  templateUrl: './tribunal-list.component.html',
  styleUrls: ['./tribunal-list.component.css']
})
export class TribunalListComponent implements OnInit {
  coursAppel: any[] = [];
  premieresInstance: any[] = [];
  filteredCoursAppel: any[] = [];
  filteredPremieresInstance: any[] = [];

  loading = false;
  error = '';
  isModalOpen = false;

  // Pagination
  pageSize = 2;
  currentPageCour = 1;
  currentPagePrem = 1;

  // Filtrage
  searchVille: string = '';

  // Toggle global
  allTribunauxActive: boolean = true; // true = tous actifs, false = tous désactivés
  toggleLoading: boolean = false;

  constructor(private tribunalService: TribunalService) {}

  ngOnInit(): void {
    this.getTribunaux();
  }

  getTribunaux(): void {
    this.loading = true;
    this.tribunalService.getTribunauxClassifies().subscribe({
      next: resp => {
        this.coursAppel = resp["Cour d'Appel"] || [];
        this.premieresInstance = resp["Première Instance"] || [];
        this.filteredCoursAppel = [...this.coursAppel];
        this.filteredPremieresInstance = [...this.premieresInstance];

        // Déterminer si tous les tribunaux sont actifs
        const allCourActifs = this.coursAppel.every(t => t.etatTribunal);
        const allPremActifs = this.premieresInstance.every(t => t.etatTribunal);
        this.allTribunauxActive = allCourActifs && allPremActifs;

        this.loading = false;
      },
      error: err => {
        this.error = 'Erreur lors de la récupération des tribunaux.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  // --- Filtrage par ville ---
  filterTribunaux(): void {
    const ville = this.searchVille.toLowerCase().trim();

    this.filteredCoursAppel = this.coursAppel.filter(t =>
      !ville || t.ville.toLowerCase().includes(ville)
    );

    this.filteredPremieresInstance = this.premieresInstance.filter(t =>
      !ville || t.ville.toLowerCase().includes(ville)
    );

    this.currentPageCour = 1;
    this.currentPagePrem = 1;
  }

  // Nombre total de pages
  get totalPagesCour(): number {
    return Math.ceil(this.filteredCoursAppel.length / this.pageSize);
  }
  get totalPagesPrem(): number {
    return Math.ceil(this.filteredPremieresInstance.length / this.pageSize);
  }

  // Éléments à afficher
  get pagedCoursAppel(): any[] {
    const start = (this.currentPageCour - 1) * this.pageSize;
    return this.filteredCoursAppel.slice(start, start + this.pageSize);
  }
  get pagedPremieresInstance(): any[] {
    const start = (this.currentPagePrem - 1) * this.pageSize;
    return this.filteredPremieresInstance.slice(start, start + this.pageSize);
  }

  // Navigation
  prevPage() {
    if (this.currentPageCour > 1) {
      this.currentPageCour--;
    }
    if (this.currentPagePrem > 1) {
      this.currentPagePrem--;
    }
  }

  nextPage() {
    if (this.currentPageCour < this.totalPagesCour) {
      this.currentPageCour++;
    }
    if (this.currentPagePrem < this.totalPagesPrem) {
      this.currentPagePrem++;
    }
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  // 🔹 Méthode pour activer/désactiver tous les tribunaux
  toggleAllTribunaux(): void {
    this.toggleLoading = true;
    this.tribunalService.toggleAllTribunaux().subscribe({
      next: res => {
        // Inverser l'état local
        this.allTribunauxActive = !this.allTribunauxActive;

        // Mettre à jour tous les tribunaux affichés
        this.coursAppel.forEach(t => t.etatTribunal = this.allTribunauxActive);
        this.premieresInstance.forEach(t => t.etatTribunal = this.allTribunauxActive);
        this.filteredCoursAppel.forEach(t => t.etatTribunal = this.allTribunauxActive);
        this.filteredPremieresInstance.forEach(t => t.etatTribunal = this.allTribunauxActive);

        this.toggleLoading = false;
      },
      error: err => {
        console.error('Erreur lors du toggle global:', err);
        this.toggleLoading = false;
        alert('Erreur lors de l’activation/désactivation des tribunaux.');
      }
    });
  }
}
