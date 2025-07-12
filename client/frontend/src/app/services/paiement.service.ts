import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Consignation {
  montant: number;
  paymentStatus: string;
  consignationId: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  montant: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private baseUrl = 'http://localhost:7501/stripe/consignation';

  constructor(private http: HttpClient) {}

  getConsignationByNumAffaire(numAffaire: string): Observable<Consignation> {
    return this.http.get<Consignation>(`${this.baseUrl}/affaire/${numAffaire}`);
  }

  createPaymentIntent(consignationId: string): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(`${this.baseUrl}/create-payment-intent`, { consignationId });
  }

  confirmPayment(paymentIntentId: string, consignationId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm-payment`, { paymentIntentId, consignationId });
  }
}
