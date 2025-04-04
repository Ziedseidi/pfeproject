import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'http://localhost:7501/role'; // Base URL de l'API

  constructor(private http: HttpClient) {}

  // Fonction pour obtenir les headers d'authentification avec le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Créer un rôle
  createRole(roleData: { nom: string; description: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create_Role`, roleData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création du rôle:', error);
        return throwError(() => new Error('Erreur lors de la création du rôle.'));
      })
    );
  }

  // Récupérer tous les rôles
  getAllRoles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Roles`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des rôles:', error);
        return throwError(() => new Error('Erreur lors de la récupération des rôles.'));
      })
    );
  }

  // Supprimer un rôle
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_Role/${roleId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression du rôle:', error);
        return throwError(() => new Error('Erreur lors de la suppression du rôle.'));
      })
    );
  }
}
