import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AffaireService {
  private apiUrl = 'http://localhost:7501/affaire'; // à adapter

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer le token et générer les headers d'auth
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
  addAffaire(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_Affaire`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error("Erreur lors de l'ajout de l'affaire :", error);
        return throwError(() => new Error("Erreur lors de l'ajout de l'affaire."));
      })
    );
  }
  getAllAffaires(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/allAffaires`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error('Erreur lors de la récupération des affaires :', err);
          return throwError(() => new Error('Erreur lors de la récupération des affaires.'));
        })
      );
  }}