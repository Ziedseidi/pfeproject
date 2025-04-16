import { Component, OnInit } from '@angular/core';
import { AvocatService } from '../services/avocat.service';

@Component({
  selector: 'app-list-avocats',
  templateUrl: './list-avocats.component.html',
  styleUrls: ['./list-avocats.component.css']
})
export class ListAvocatsComponent implements OnInit {
  avocats: any[] = [];
  filteredAvocats: any[] = []; // Liste filtrée des avocats
  regionSearch: string = ''; // Variable pour rechercher par région
  degreSearch: string = ''; // Variable pour rechercher par degré de juridiction

  constructor(private avocatService: AvocatService) {}

  ngOnInit(): void {
    this.avocatService.getAvocatsOrdonnes().subscribe(
      (response) => {
        this.avocats = response;
        this.filteredAvocats = response; // Initialement, tous les avocats sont affichés
      },
      (error) => {
        console.error('Erreur lors de la récupération des avocats:', error);
      }
    );
  }

  getNiveauLabel(degre: string): string {
    switch (degre) {
      case 'Cassation':
        return 'Niveau 3 : Cassation';
      case 'Première Instance':
        return 'Niveau 2 : Première Instance';
      case 'Appel':
        return 'Niveau 1 : Appel';
      default:
        return 'Niveau Inconnu';
    }
  }

  // Méthode pour filtrer les avocats en fonction de la recherche
  filterAvocats(): void {
    this.filteredAvocats = this.avocats.filter(avocat => {
      // Recherche de la région : si une région est spécifiée, on filtre selon la correspondance
      const matchesRegion = this.regionSearch ? avocat.region.toLowerCase().includes(this.regionSearch.toLowerCase()) : true;
      // Recherche du degré de juridiction : si un degré est spécifié, on filtre selon la correspondance
      const matchesDegre = this.degreSearch ? avocat.degreJuridiction.toLowerCase().includes(this.degreSearch.toLowerCase()) : true;

      // Retourne vrai si les deux conditions de filtrage sont remplies
      return matchesRegion && matchesDegre;
    });
  }
}
