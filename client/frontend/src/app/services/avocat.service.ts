import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvocatService {
  private apiUrl = 'http://localhost:7501/avocat/register_Avocat'; // URL du backend

  constructor(private http: HttpClient) {}

  // Méthode pour enregistrer l'avocat avec l'image
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

    // Ajoute l'image de profil au FormData
    if (file) {
      formData.append('imageprofile', file, file.name);  // Le fichier est ajouté sous la clé 'imageprofile'
    }

    // Envoie la requête POST avec FormData
    return this.http.post(this.apiUrl, formData);
  }
}
