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
  loading = false;
  error = '';
  isModalOpen = false;

  // Pagination
  pageSize = 2;
  currentPageCour = 1;
  currentPagePrem = 1;

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
        this.loading = false;
      },
      error: err => {
        this.error = 'Erreur lors de la récupération des tribunaux.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Nombre total de pages
  get totalPagesCour(): number {
    return Math.ceil(this.coursAppel.length / this.pageSize);
  }
  get totalPagesPrem(): number {
    return Math.ceil(this.premieresInstance.length / this.pageSize);
  }

  // Sélection des éléments à afficher
  get pagedCoursAppel(): any[] {
    const start = (this.currentPageCour - 1) * this.pageSize;
    return this.coursAppel.slice(start, start + this.pageSize);
  }
  get pagedPremieresInstance(): any[] {
    const start = (this.currentPagePrem - 1) * this.pageSize;
    return this.premieresInstance.slice(start, start + this.pageSize);
  }

  // Navigation générale
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
}
