import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:7501/auth/login'; // URL de connexion
  private logoutUrl = 'http://localhost:7501/auth/logout'; // URL de déconnexion
  private userInfoUrl = 'http://localhost:7501/auth/user-info';  // URL de récupération des informations de l'utilisateur

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Méthode pour supprimer le token (déconnexion)
  clearToken(): void {
    localStorage.removeItem('token');
  }

  // Méthode pour récupérer les informations de l'utilisateur connecté
  getUserInfo(): Observable<any> {
    const token = this.getToken();
    if (token) {
      // Ajout du token dans les en-têtes pour l'authentification
      return this.http.get<any>(this.userInfoUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else {
      throw new Error('Token manquant');
    }
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): Observable<any> {
    return this.http.post<any>(this.logoutUrl, {});
  }
}
