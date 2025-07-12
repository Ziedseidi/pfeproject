import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Saisie {
  montant: number;
  paymentStatus: string;
  saisieId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaiementSaisieService {

  private baseUrl = 'http://localhost:7501/stripe_saisie'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  getSaisieByNumeroAffaire(numeroAffaire: string): Observable<Saisie> {
    return this.http.get<Saisie>(`${this.baseUrl}/${numeroAffaire}`);
  }

  createPaymentIntent(saisieId: string) {
    return this.http.post<any>(`${this.baseUrl}/create-payment-intent`, { saisieId });
  }

  confirmPayment(paymentIntentId: string, saisieId: string) {
    return this.http.post<any>(`${this.baseUrl}/confirm-payment`, { paymentIntentId, saisieId });
  }
}
