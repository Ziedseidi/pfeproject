import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';  // Importer DatePipe

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() card: any;  // Recevoir les données de la carte

  constructor(private datePipe: DatePipe) {}

  // Formater la date actuelle
  getFormattedDate(): string {
    return this.datePipe.transform(new Date(), 'd MMMM y') || '';  // Format : Jour Mois Année
  }
}
