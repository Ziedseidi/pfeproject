// facture.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:7501/facture'; // adapte selon ton URL

  constructor(private http: HttpClient) {}

  downloadFactureByNumeroAffaire(numeroAffaire: string) {
    return this.http.get(`${this.apiUrl}/${numeroAffaire}`, {
      responseType: 'blob' // très important pour recevoir un fichier PDF
    });
  }
}
