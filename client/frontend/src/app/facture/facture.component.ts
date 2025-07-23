// facture.component.ts
import { Component } from '@angular/core';
import { FactureService } from '../services/facture.service';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent {
  numeroAffaire = '';

  constructor(private factureService: FactureService) {}

  onTelechargerFacture() {
    this.factureService.downloadFactureByNumeroAffaire(this.numeroAffaire).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Pour afficher dans un nouvel onglet
        window.open(url);

        // Ou pour forcer le téléchargement :
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = `facture_${this.numeroAffaire}.pdf`;
        // a.click();
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement', err);
      }
    });
  }
}
