import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class clientService {
  private apiUrl = 'http://localhost:7501/client/register_Client'; // URL de ton backend

  constructor(private http: HttpClient) {}

  registerClient(clientData: any, file: File): Observable<any> {
    console.log('Données envoyées au backend:', clientData); // Debug

    // Créer une instance de FormData
    const formData: FormData = new FormData();
    
    // Ajouter les données du client au FormData
    formData.append('nom', clientData.nom);
    formData.append('prenom', clientData.prenom);
    formData.append('email', clientData.email);
    formData.append('password', clientData.password);
    formData.append('phone', clientData.phone);

    // Ajouter l'image au FormData
    if (file) {
      formData.append('imageprofile', file, file.name);
    }

    // Envoi de la requête POST avec le FormData
    return this.http.post(this.apiUrl, formData);
  }
}
