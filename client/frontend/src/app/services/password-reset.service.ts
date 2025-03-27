import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = 'http://localhost:7501/password'; // URL du backend

  constructor(private http: HttpClient) {}

  // Étape 1: Demander la réinitialisation du mot de passe
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password-reset`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  // Étape 2: Valider le token
  validateToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reset-password/${token}`).pipe(
      catchError(this.handleError)
    );
  }

  // Étape 3: Réinitialiser le mot de passe avec le token
  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, { newPassword, confirmPassword }).pipe(
      catchError(this.handleError)
    );
  }

  // Méthode pour gérer les erreurs globales
  private handleError(error: any): Observable<any> {
    console.error('Erreur dans le service de réinitialisation du mot de passe :', error);
    throw error; // Vous pouvez également retourner un message d'erreur spécifique ici si nécessaire
  }
}
