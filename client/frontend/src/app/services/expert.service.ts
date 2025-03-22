import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  private apiUrl = 'http://localhost:7501/expert/register_Expert'; // URL de ton backend

  constructor(private http: HttpClient) {}

  // Méthode pour inscrire un expert
  registerExpert(expertData: any, file: File): Observable<any> {
    console.log('Données envoyées au backend:', expertData); // Pour debugger

    // Créer une instance de FormData
    const formData: FormData = new FormData();
    
    // Ajouter les données de l'expert au FormData
    formData.append('nom', expertData.nom);
    formData.append('prenom', expertData.prenom);
    formData.append('email', expertData.email);
    formData.append('password', expertData.password);
    formData.append('phone', expertData.phone);
    formData.append('adresse', expertData.adresse);
    formData.append('dateExpertise', expertData.dateExpertise);
    formData.append('fraisExpertise', expertData.fraisExpertise);

    // Ajouter l'image de profil si elle est présente
    if (file) {
      formData.append('imageprofile', file, file.name);
    }

    // Envoi de la requête POST avec le FormData
    return this.http.post(this.apiUrl, formData);
  }
}
