import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Dossier {
  _id: string;
  numeroAffaire: string;
  titre: string;
  description: string;
  dateCreation: string;
  imagesFichier: string[];  // Tableau de liens des images
  nomAvocat: string;
  prenomAvocat: string;
}

@Injectable({ providedIn: 'root' })
export class DossierService {

  private apiUrl = 'http://localhost:7501/dossier';  // L'URL de ton API backend

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token non trouvé');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Récupérer tous les dossiers
  getAllDossiers(): Observable<Dossier[]> {
    return this.http.get<Dossier[]>(`${this.apiUrl}/dossiers`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Erreur récupération dossiers :', err);
        return throwError(() => new Error('Erreur récupération dossiers'));
      })
    );
  }

  // Récupérer un dossier par ID
  getDossierById(id: string): Observable<Dossier> {
    return this.http.get<Dossier>(`${this.apiUrl}/dossier/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Erreur récupération dossier :', err);
        return throwError(() => new Error('Erreur récupération dossier'));
      })
    );
  }

  // Ajouter un dossier avec fichiers (FormData)
  ajouterDossier(payload: {
    numeroAffaire: string;
    titre: string;
    description: string;
    imagesFichier: File[];  // Les fichiers à joindre
  }): Observable<any> {

    const fd = new FormData();
    fd.append('numeroAffaire', payload.numeroAffaire);
    fd.append('titre', payload.titre);
    fd.append('description', payload.description);

    // Ajouter chaque fichier dans FormData
    payload.imagesFichier.forEach(file => {
      fd.append('imagesFichier', file, file.name);  // Ajouter les fichiers avec leur nom original
    });

    return this.http.post(`${this.apiUrl}/ajouter-Dossier`, fd, {
  headers: this.getAuthHeaders(),  // <-- Ici tu mets uniquement le header Authorization, pas Content-Type
}).pipe(
      catchError(err => {
        console.error('Erreur lors de l\'ajout du dossier :', err);
        return throwError(() => new Error('Erreur lors de l\'ajout du dossier'));
      })
    );
  }
}
