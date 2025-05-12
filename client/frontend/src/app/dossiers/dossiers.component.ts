import { Component, OnInit } from '@angular/core';
import { DossierService, Dossier } from '../services/dossier.service'; // Assure-toi que le chemin est correct
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators'; // Importation pour gérer les erreurs
import { throwError } from 'rxjs'; // Pour lancer une erreur si nécessaire

@Component({
  selector: 'app-dossiers',
  templateUrl: './dossiers.component.html',
  styleUrls: ['./dossiers.component.css']
})
export class DossiersComponent implements OnInit {
  dossiers: Dossier[] = [];
  errorMessage: string = ''; // Variable pour afficher les erreurs

  constructor(private dossierService: DossierService, private router: Router) {}

  ngOnInit(): void {
    this.getAllDossiers();
  }

  getAllDossiers(): void {
    this.dossierService.getAllDossiers().pipe(
      catchError((err) => {
        this.errorMessage = 'Erreur lors de la récupération des dossiers'; // Gestion des erreurs
        console.error('Erreur lors de la récupération des dossiers :', err);
        return throwError(() => new Error('Erreur lors de la récupération des dossiers'));
      })
    ).subscribe({
      next: (dossiers: Dossier[]) => {
        this.dossiers = dossiers; // Assignation des dossiers récupérés à la variable
      },
      error: (err) => {
        console.error('Erreur dans le subscribe:', err);
      }
    });
  }
}
