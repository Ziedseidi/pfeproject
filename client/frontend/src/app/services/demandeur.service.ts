import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeurService {
  private apiUrl = 'http://localhost:7501/demandeur/register_Demandeur'; // URL de ton backend

  constructor(private http: HttpClient) {}

  registerDemandeur(demandeurData: any, file: File): Observable<any> {
    console.log('Données envoyées au backend:', demandeurData); // Debug

    // Créer une instance de FormData
    const formData: FormData = new FormData();
    
    // Ajouter les données du demandeur au FormData
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

    // Ajouter l'image au FormData (si présente)
    if (file) {
      formData.append('imageprofile', file, file.name);
    }

    // Envoi de la requête POST avec le FormData
    return this.http.post(this.apiUrl, formData);
  }
}
