import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AffaireService {
  private apiUrl = 'http://localhost:7501/affaire'; // URL à adapter si nécessaire

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

  // Ajouter une affaire
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

  // Récupérer toutes les affaires
  getAllAffaires(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allAffaires`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error('Erreur lors de la récupération des affaires :', err);
          return throwError(() => new Error('Erreur lors de la récupération des affaires.'));
        })
      );
  }

  // Récupérer les avocats éligibles pour une affaire
  getAvocatsEligibles(affaireId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/avocats-eligibles/${affaireId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des avocats éligibles :', error);
        return throwError(() => new Error('Erreur lors de la récupération des avocats éligibles.'));
      })
    );
  }

  // Assigner un avocat à une affaire
  assignAvocatToAffaire(utilisateurId: string, affaireId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/assign_avocat`,
      { utilisateurId, affaireId },
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error('Erreur lors de l\'assignation de l\'avocat:', err);
        return throwError(() => new Error(err.error?.message || 'Erreur inconnue lors de l\'assignation.'));
      })
    );
  }
  rechercherAffaireParNumero(numeroAffaire: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/rechercheAffaire/${numeroAffaire}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la recherche de l\'affaire :', error);
        return throwError(() => new Error('Erreur lors de la recherche de l\'affaire.'));
      })
    );
  }

  assignTribunalToAffaire(avocatId: string, affaireId: string, tribunalId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/assign-tribunal`,
      { avocatId, affaireId, tribunalId },
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error('Erreur lors de l\'assignation du tribunal à l\'affaire:', err);
        return throwError(() => new Error(err.error?.message || 'Erreur inconnue lors de l\'assignation du tribunal.'));
      })
    );
  }
  getTribunauxCompatibles(affaireId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/compatibles/${affaireId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error("Erreur lors de la récupération des tribunaux compatibles :", error);
        return throwError(() => new Error("Erreur lors de la récupération des tribunaux compatibles."));
      })
    );
  }
  
}
