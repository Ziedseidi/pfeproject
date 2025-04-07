import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:7501/user'; // Remplacez par l'URL de votre API
  private utilisateursSubject = new BehaviorSubject<User[]>([]);
  utilisateurs$ = this.utilisateursSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fonction pour obtenir les headers d'authentification avec le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // 📥 Récupérer tous les utilisateurs avec leurs informations spécifiques
  getUsersWithDetails(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<User[]>(`${this.baseUrl}/All-users`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
          return throwError(() => new Error('Erreur lors de la récupération des utilisateurs'));
        })
      );
  }

  // 🔁 Activer / désactiver un utilisateur
  toggleUserActivation(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .patch(`${this.baseUrl}/toggleUserActivation/${userId}`, {}, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors du changement de l\'état de l\'utilisateur :', error);
          return throwError(() => new Error('Erreur lors de l\'activation/désactivation'));
        })
      );
  }

  // ❌ Supprimer un utilisateur (et ses données associées)
  deleteUser(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .delete(`${this.baseUrl}/deleteUser/${userId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          return throwError(() => new Error('Erreur lors de la suppression'));
        })
      );
  }

  // ✉️ Envoi d'un email à un utilisateur
  sendEmail(userId: string, subject: string, emailContent: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .post(`${this.baseUrl}/send-email-to-user`, { userId, subject, emailContent }, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de l\'envoi de l\'email:', error);
          return throwError(() => new Error('Erreur lors de l\'envoi de l\'email'));
        })
      );
  }
}
