import { Component, OnInit } from '@angular/core';
import { PaiementSaisieService } from '../services/paiement-saisie.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payer-saisie',
  templateUrl: './payer-saisie.component.html',
  styleUrls: ['./payer-saisie.component.css']
})
export class PayerSaisieComponent implements OnInit {

  numeroAffaire = '';
  saisie: any = null;
  loading = false;

  stripe!: Stripe | null;
  card!: StripeCardElement | null;
  clientSecret = '';
  paymentIntentId = '';
  paymentIntentCreated = false;
  showCard = false;
  cardErrors = '';

  constructor(private paiementSaisieService: PaiementSaisieService) {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51Rk5mYC6DM5ws9JSvFz309UJBE88EjqGzTLBpTSFtoMEw7n7HXl76DqwG37grQb1nJ4sFUkjzkx7diR7MTLOIoI700ypcFpG5Q'); // ta clé publique Stripe
  }

  chargerSaisie() {
    if (!this.numeroAffaire.trim()) return;

    this.loading = true;
    this.paiementSaisieService.getSaisieByNumeroAffaire(this.numeroAffaire.trim()).subscribe({
      next: (data) => {
        this.saisie = data;
        this.paymentIntentCreated = false;
        this.showCard = true;
        this.loading = false;

        setTimeout(() => this.monterCarteStripe(), 0);
      },
      error: (err) => {
        alert('Erreur lors du chargement : ' + (err.error?.error || err.message));
        this.loading = false;
      }
    });
  }

  monterCarteStripe() {
    if (!this.stripe) {
      alert("Stripe non chargé.");
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
    if (!this.saisie) return;

    this.loading = true;
    this.paiementSaisieService.createPaymentIntent(this.saisie.saisieId).subscribe({
      next: (data) => {
        this.clientSecret = data.clientSecret;
        this.paymentIntentId = data.paymentIntentId;
        this.paymentIntentCreated = true;
        this.loading = false;
      },
      error: (err) => {
        alert('Erreur création paiement : ' + (err.error?.error || err.message));
        this.loading = false;
      }
    });
  }

  async confirmerPaiement() {
    if (!this.stripe || !this.card || !this.clientSecret) return;

    this.loading = true;
    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card,
      }
    });

    if (result.error) {
      alert('Erreur paiement : ' + result.error.message);
      this.loading = false;
    } else {
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        this.paiementSaisieService.confirmPayment(this.paymentIntentId, this.saisie.saisieId).subscribe({
          next: () => {
            alert('✅ Paiement confirmé avec succès');
            this.saisie.paymentStatus = 'paid';
            this.loading = false;
          },
          error: (err) => {
            alert('Erreur confirmation backend : ' + (err.error?.error || err.message));
            this.loading = false;
          }
        });
      } else {
        alert('❌ Paiement non réussi');
        this.loading = false;
      }
    }
  }
}
