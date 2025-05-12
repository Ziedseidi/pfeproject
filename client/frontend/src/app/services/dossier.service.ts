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
  imagesFichier: string[];
  nomAvocat: string; // Le nom de l'avocat
  prenomAvocat: string; // Le prénom de l'avocat
}

@Injectable({
  providedIn: 'root'
})
export class DossierService {
  private apiUrl = 'http://localhost:7501/dossier'; // Corrigé le chemin

  constructor(private http: HttpClient) {}

  // Ajouter les headers avec token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllDossiers(): Observable<Dossier[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Dossier[]>(`${this.apiUrl}/dossiers`, { headers }).pipe(
      catchError(error => {
        console.error('Erreur récupération dossiers :', error);
        return throwError(() => new Error('Erreur récupération dossiers'));
      })
    );
  }

  getDossierById(id: string): Observable<Dossier> {
    const headers = this.getAuthHeaders();
    return this.http.get<Dossier>(`${this.apiUrl}/dossier/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Erreur récupération dossier :', error);
        return throwError(() => new Error('Erreur récupération dossier'));
      })
    );
  }
}
