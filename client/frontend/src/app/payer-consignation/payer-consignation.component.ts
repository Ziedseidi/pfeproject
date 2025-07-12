import { Component, OnInit } from '@angular/core';
import { PaiementService } from '../services/paiement.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payer-consignation',
  templateUrl: './payer-consignation.component.html',
  styleUrls: ['./payer-consignation.component.css']
})
export class PayerConsignationComponent implements OnInit {

  numAffaire = '';
  consignation: any = null;
  loading = false;

  stripe!: Stripe | null;
  card!: StripeCardElement | null;
  clientSecret = '';
  paymentIntentId = '';
  paymentIntentCreated = false;
  showCard = false;
  cardErrors = '';
  errorMessage = '';   // ✅ ajouté pour corriger l'erreur

  constructor(private paiementService: PaiementService) {}

  async ngOnInit() {
    // Charger Stripe avec la clé publique test
    this.stripe = await loadStripe('pk_test_51Rk5mYC6DM5ws9JSvFz309UJBE88EjqGzTLBpTSFtoMEw7n7HXl76DqwG37grQb1nJ4sFUkjzkx7diR7MTLOIoI700ypcFpG5Q');
  }

  chargerConsignation() {
    if (!this.numAffaire.trim()) return;

    this.loading = true;
    this.errorMessage = '';  // ✅ reset
    this.paiementService.getConsignationByNumAffaire(this.numAffaire.trim()).subscribe({
      next: (data) => {
        this.consignation = data;
        this.paymentIntentCreated = false;
        this.showCard = true;
        this.loading = false;
        this.errorMessage = '';

        // Initialiser Stripe Elements après avoir affiché le champ
        setTimeout(() => this.monterCarteStripe(), 0);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement : ' + (err.error?.error || err.message);
        this.loading = false;
      }
    });
  }

  monterCarteStripe() {
    if (!this.stripe) {
      this.errorMessage = "Stripe non chargé.";
      return;
    }

    const elements = this.stripe.elements();

    if (this.card) {
      this.card.unmount();
    }

    this.card = elements.create('card');
    this.card.mount('#card-element');

    this.card.on('change', (event) => {
      this.cardErrors = event.error?.message || '';
    });
  }

  creerPaymentIntent() {
    if (!this.consignation) return;

    this.loading = true;
    this.errorMessage = '';  // ✅ reset
    this.paiementService.createPaymentIntent(this.consignation.consignationId).subscribe({
      next: (data) => {
        this.clientSecret = data.clientSecret;
        this.paymentIntentId = data.paymentIntentId;
        this.paymentIntentCreated = true;
        this.loading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Erreur création paiement : ' + (err.error?.error || err.message);
        this.loading = false;
      }
    });
  }

  async confirmerPaiement() {
    if (!this.stripe || !this.card || !this.clientSecret) return;

    this.loading = true;
    this.errorMessage = '';  // ✅ reset

    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card
      }
    });

    if (result.error) {
      this.errorMessage = 'Erreur paiement : ' + result.error.message;
      this.loading = false;
    } else {
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        this.paiementService.confirmPayment(this.paymentIntentId, this.consignation.consignationId).subscribe({
          next: () => {
            alert('✅ Paiement confirmé avec succès');
            this.consignation.paymentStatus = 'paid';
            this.loading = false;
            this.errorMessage = '';
          },
          error: (err) => {
            this.errorMessage = 'Erreur confirmation backend : ' + (err.error?.error || err.message);
            this.loading = false;
          }
        });
      } else {
        this.errorMessage = '❌ Paiement non réussi';
        this.loading = false;
      }
    }
  }
}
