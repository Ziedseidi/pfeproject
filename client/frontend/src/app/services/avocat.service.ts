import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AvocatService {
  private apiUrl = 'http://localhost:7501/avocat/register_Avocat'; // URL pour enregistrer l'avocat
  private getAvocatsUrl = 'http://localhost:7501/avocat/avocats'; // URL pour récupérer les avocats triés

  constructor(private http: HttpClient) {}

  // Fonction pour obtenir les headers d'authentification avec le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  // Récupérer le token depuis le localStorage
    if (!token) {
      throw new Error('Token non trouvé');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Ajouter le token dans les headers
    });
  }

  // Méthode pour enregistrer l'avocat avec l'image (pas besoin de token ici)
  registerAvocat(avocatData: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    
    // Ajoute les autres données de l'avocat
    formData.append('nom', avocatData.nom);
    formData.append('prenom', avocatData.prenom);
    formData.append('email', avocatData.email);
    formData.append('password', avocatData.password);
    formData.append('phone', avocatData.phone);
    formData.append('adresse', avocatData.adresse);
    formData.append('honoraires', avocatData.honoraires.toString());  // Convertir en chaîne si nécessaire
    formData.append('region', avocatData.region);
    formData.append('degreJuridiction', avocatData.degreJuridiction); // Ajout du degré de juridiction

    if (file) {
      formData.append('imageprofile', file, file.name);
    }

    // Pas besoin de token pour cette méthode, donc on ne l'ajoute pas aux headers
    return this.http.post(this.apiUrl, formData).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'enregistrement de l\'avocat:', error);
        return throwError(() => new Error('Erreur lors de l\'enregistrement de l\'avocat.'));
      })
    );
  }

  // Méthode pour récupérer les avocats triés par leur degré de juridiction (nécessite le token)
  getAvocatsOrdonnes(): Observable<any> {
    // Ajoute le token aux headers de la requête pour cette méthode
    return this.http.get<any[]>(this.getAvocatsUrl, {
      headers: this.getAuthHeaders()  // Ajouter les headers d'authentification
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des avocats :', error);
        return throwError(() => new Error('Erreur lors de la récupération des avocats.'));
      })
    );
  }
}
