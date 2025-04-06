// src/app/services/user.service.ts
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

  // Récupérer les utilisateurs avec leurs détails
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
}
