import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface PdfContrat {
  url: string;
  numeroAffaire: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private apiUrl = 'http://localhost:7501/contrat';
  
  constructor(private http: HttpClient) {}

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

  getPdfContrats(): Observable<PdfContrat[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<PdfContrat[]>(`${this.apiUrl}/pdfs`, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération des PDFs:', error);
          return throwError(() => new Error('Échec de la récupération des PDFs. Veuillez réessayer plus tard.'));
        })
      );
  }
}
