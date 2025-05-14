import { Component, OnInit } from '@angular/core';
import { AffaireService } from '../services/affaire.service';

@Component({
  selector: 'app-mes-affaires-liste',
  templateUrl: './mes-affaires-liste.component.html',
  styleUrls: ['./mes-affaires-liste.component.css']
})
export class MesAffairesListeComponent implements OnInit {
  affaires: any[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm: string = '';

  constructor(private affaireService: AffaireService) {}

  ngOnInit(): void {
    this.affaireService.getMesAffaires().subscribe({
      next: (data) => {
        this.affaires = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  get filteredAffaires(): any[] {
    if (!this.searchTerm) return this.affaires;
    const lowerTerm = this.searchTerm.toLowerCase();
    return this.affaires.filter(affaire =>
      affaire.numeroAffaire?.toLowerCase().includes(lowerTerm) ||
      affaire.objet?.toLowerCase().includes(lowerTerm)
    );
  }
}
