import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TribunalService {
  private baseUrl = 'http://localhost:7501/tribunal'; // URL de l'API

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Ajouter un tribunal
  addTribunal(tribunalData: any, file: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('nom', tribunalData.nom);
    formData.append('adresse', tribunalData.adresse);
    formData.append('ville', tribunalData.ville);
    formData.append('telephone', tribunalData.telephone);
    formData.append('email', tribunalData.email);
    formData.append('typeTribunal', tribunalData.typeTribunal);
    formData.append('etatTribunal', tribunalData.etatTribunal.toString());
    
    if (file) {
      formData.append('imageTribunal', file, file.name);
    }

    return this.http.post(`${this.baseUrl}/add_Tribunal`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'ajout du tribunal:', error);
        return throwError(() => new Error('Erreur lors de l\'ajout du tribunal.'));
      })
    );
  }
  getTribunauxClassifies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Tribunaux`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des tribunaux:', error);
        return throwError(() => new Error('Erreur lors de la récupération des tribunaux.'));
      })
    );
  }
  toggleAllTribunaux(): Observable<any> {
    return this.http.patch(`${this.baseUrl}/toggleAllTribunaux`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors du toggle de l\'état des tribunaux:', error);
        return throwError(() => new Error('Erreur lors du toggle de l\'état des tribunaux.'));
      })
    );
  }
}
