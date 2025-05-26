import { Component, OnInit } from '@angular/core';
import { DossierService, Dossier } from '../services/dossier.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-dossiers',
  templateUrl: './dossiers.component.html',
  styleUrls: ['./dossiers.component.css']
})
export class DossiersComponent implements OnInit {
  dossiers: Dossier[] = [];
  searchTerm: string = ''; // Texte tapé dans la barre de recherche
  errorMessage: string = '';

  constructor(private dossierService: DossierService, private router: Router) {}

  ngOnInit(): void {
    this.getAllDossiers();
  }

  getAllDossiers(): void {
    this.dossierService.getAllDossiers().pipe(
      catchError((err) => {
        this.errorMessage = 'Erreur lors de la récupération des dossiers';
        console.error('Erreur lors de la récupération des dossiers :', err);
        return throwError(() => new Error('Erreur lors de la récupération des dossiers'));
      })
    ).subscribe({
      next: (dossiers: Dossier[]) => {
        this.dossiers = dossiers;
      },
      error: (err) => {
        console.error('Erreur dans le subscribe:', err);
      }
    });
  }

  get filteredDossiers(): Dossier[] {
    return this.dossiers.filter(dossier =>
      dossier.numeroAffaire?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
