import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private apiUrl = 'http://localhost:7501/contrat'; // URL à adapter si nécessaire
  
  constructor(private http: HttpClient) {}

  // Fonction pour récupérer le token et générer les headers d'auth
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token non trouvé');
      throw new Error('Token non trouvé');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Méthode pour créer un contrat
  createContrat(contratData: any): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post<any>(`${this.apiUrl}/ajouterContrat`, contratData, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la création du contrat:', error);
          return throwError(() => new Error('Échec de la création du contrat. Veuillez réessayer plus tard.'));
        })
      );
  }
}
