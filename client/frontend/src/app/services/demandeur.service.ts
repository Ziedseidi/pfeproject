import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeurService {
  private apiUrl = 'http://localhost:7501/personel/register_PersonelJuredique'; // URL de ton backend

  constructor(private http: HttpClient) {}

  registerDemandeur(demandeurData: any, file: File): Observable<any> {
    console.log('Données envoyées au backend:', demandeurData); // Debug

    // Créer une instance de FormData
    const formData: FormData = new FormData();
    
    formData.append('nom', demandeurData.nom);
    formData.append('prenom', demandeurData.prenom);
    formData.append('email', demandeurData.email);
    formData.append('password', demandeurData.password);
    formData.append('phone', demandeurData.phone);
    formData.append('cin', demandeurData.cin);
    formData.append('matricule', demandeurData.matricule);
    formData.append('ficheCarriere', demandeurData.ficheCarriere);
    formData.append('contratTravail', demandeurData.contratTravail);
    formData.append('decisionsPromotions', demandeurData.decisionsPromotions);

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
}
