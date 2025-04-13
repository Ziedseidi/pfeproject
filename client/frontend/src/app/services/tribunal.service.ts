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
    
    // Ajouter l'image uniquement si elle est présente
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
}
