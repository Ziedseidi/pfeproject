import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class clientService {
  private apiUrl = 'http://localhost:7501/client/register_Client'; // URL du backend

  constructor(private http: HttpClient) {}

  // Méthode pour enregistrer le client avec l'image
  registerClient(clientData: any, file: File): Observable<any> {
    console.log('Données envoyées au backend:', clientData);  // Pour déboguer

    const formData: FormData = new FormData();
    formData.append('nom', clientData.nom);
    formData.append('prenom', clientData.prenom);
    formData.append('email', clientData.email);
    formData.append('password', clientData.password);
    formData.append('phone', clientData.phone);

    // Ajoute l'image au FormData
    if (file) {
      formData.append('imageprofile', file, file.name);
    }

    return this.http.post(this.apiUrl, formData);
  }
}
