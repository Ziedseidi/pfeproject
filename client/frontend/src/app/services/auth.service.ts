import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:7501/auth/login'; // URL de ton backend

  constructor(private http: HttpClient) {}

  // Méthode de login avec email et mot de passe
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password });
  }

  // Méthode pour récupérer le token depuis localStorage (utile dans d'autres services)
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Méthode pour enregistrer le token dans localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Méthode pour supprimer le token (déconnexion)
  clearToken(): void {
    localStorage.removeItem('token');
  }
}
