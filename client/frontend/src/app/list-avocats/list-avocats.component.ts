import { Component, OnInit } from '@angular/core';
import { AvocatService } from '../services/avocat.service';

@Component({
  selector: 'app-list-avocats',
  templateUrl: './list-avocats.component.html',
  styleUrls: ['./list-avocats.component.css']
})
export class ListAvocatsComponent implements OnInit {
  avocats: any[] = [];
  filteredAvocats: any[] = [];
  regionSearch: string = '';
  degreSearch: string = '';

  constructor(private avocatService: AvocatService) {}

  ngOnInit(): void {
    this.avocatService.getAvocatsOrdonnes().subscribe(
      (response) => {
        this.avocats = response;
        this.filteredAvocats = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des avocats:', error);
      }
    );
  }

  getNiveauLabel(degre: string): string {
    switch (degre) {
      case 'Cassation': return 'Niveau 3 : Cassation';
      case 'Première Instance': return 'Niveau 2 : Première Instance';
      case 'Appel': return 'Niveau 1 : Appel';
      default: return 'Niveau Inconnu';
    }
  }

  filterAvocats(): void {
    this.filteredAvocats = this.avocats.filter(avocat => {
      const matchesRegion = this.regionSearch ? avocat.region.toLowerCase().includes(this.regionSearch.toLowerCase()) : true;
      const matchesDegre = this.degreSearch ? avocat.degreJuridiction.toLowerCase().includes(this.degreSearch.toLowerCase()) : true;
      return matchesRegion && matchesDegre;
    });
  }
}
