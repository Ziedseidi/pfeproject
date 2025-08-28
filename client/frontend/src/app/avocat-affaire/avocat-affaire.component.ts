import { Component } from '@angular/core';
import { AffaireService } from '../services/affaire.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avocat-affaire',
  templateUrl: './avocat-affaire.component.html',
  styleUrls: ['./avocat-affaire.component.css']
})
export class AvocatAffaireComponent {
  avocats: any[] = [];
  filteredAvocats: any[] = [];
  loading = true;
  errorMessage = '';
  
  // Propriétés pour les filtres
  selectedRegion: string = '';
  selectedDegree: string = '';
  
  // Liste complète des 24 régions de Tunisie
  regionsList: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 
    'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Kef', 'Mahdia',
    'Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
    'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];
  
  // Degrés juridiction (à adapter selon vos besoins)
  degreesList: string[] = [
    'Première instance', 'Appel', 'Cassation', 'Administratif', 
    'Constitutionnel', 'Commercial', 'Pénal'
  ];

  constructor(private affaireService: AffaireService) {}

  ngOnInit(): void {
    this.getAvocats();
  }

  getAvocats(): void {
    this.loading = true;
    this.affaireService.getAllAvocatsWithAffaireCount().subscribe({
      next: (data) => {
        this.avocats = data;
        this.filteredAvocats = [...this.avocats];
        this.loading = false;
        
        // Mettre à jour degreesList selon les données reçues (optionnel)
        const uniqueDegrees = [...new Set(this.avocats.map(a => a.degreJuridiction))].filter(d => d);
        if (uniqueDegrees.length > 0) {
          this.degreesList = uniqueDegrees;
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors du chargement des avocats.';
        this.loading = false;
      }
    });
  }

  filterAvocats(): void {
    this.filteredAvocats = this.avocats.filter(avocat => {
      const regionMatch = !this.selectedRegion || avocat.region === this.selectedRegion;
      const degreeMatch = !this.selectedDegree || avocat.degreJuridiction === this.selectedDegree;
      return regionMatch && degreeMatch;
    });
  }

  resetFilters(): void {
    this.selectedRegion = '';
    this.selectedDegree = '';
    this.filteredAvocats = [...this.avocats];
  }
}