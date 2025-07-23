import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:7501';  // Base URL du backend

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getDegreJuridiqueStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/affaire/degre-juridique`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Erreur récupération degrés juridiques :', err);
        return throwError(() => new Error('Erreur récupération degrés juridiques'));
      })
    );
  }

  getAvocatsCountByDegreAvecAffaires(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/affaire/count-by-degre-avec-affaires`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Erreur récupération avocats :', err);
        return throwError(() => new Error('Erreur récupération avocats'));
      })
    );
  }

  getContratsCountByEtat(): Observable<{ accepté: number; refusé: number }> {
    return this.http.get<{ accepté: number; refusé: number }>(`${this.apiUrl}/contrat/staticContrat`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Erreur récupération contrats :', err);
        return throwError(() => new Error('Erreur récupération contrats'));
      })
    );
  }

  getConsignationAndSaisieStats(): Observable<{
    consignationPaid: number;
    consignationUnpaid: number;
    saisiePaid: number;
    saisieUnpaid: number;
  }> {
    return this.http.get<{
      consignationPaid: number;
      consignationUnpaid: number;
      saisiePaid: number;
      saisieUnpaid: number;
    }>(`${this.apiUrl}/affaire/payments`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Erreur récupération stats consignations/saisies :', err);
        return throwError(() => new Error('Erreur récupération stats consignations/saisies'));
      })
    );
  }

  getAffairesCountByTypeClient(): Observable<{ type: string; count: number }[]> {
    return this.http.get<{ type: string; count: number }[]>(`${this.apiUrl}/affaire/typeClient`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error('Erreur récupération statistiques par type de client :', err);
        return throwError(() => new Error('Erreur récupération statistiques par type de client'));
      })
    );
  }
  getAffairesStatusCount(): Observable<{ enCours: number; terminees: number }> {
  return this.http.get<{ enCours: number; terminees: number }>(`${this.apiUrl}/affaire/statutAffaire`, {
    headers: this.getAuthHeaders()
  }).pipe(
    catchError(err => {
      console.error('Erreur récupération statut des affaires :', err);
      return throwError(() => new Error('Erreur récupération statut des affaires'));
    })
  );
}
}
