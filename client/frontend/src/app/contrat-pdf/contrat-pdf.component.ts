import { Component, OnInit } from '@angular/core';
import { ContratService } from '../services/contrat.service';

@Component({
  selector: 'app-contrat-pdf',
  templateUrl: './contrat-pdf.component.html',
  styleUrls: ['./contrat-pdf.component.css']
})
export class ContratPdfComponent implements OnInit {
  pdfs: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private contratService: ContratService) {}

  ngOnInit(): void {
    this.loadPdfs();
  }

  loadPdfs(): void {
    this.contratService.getPdfContrats().subscribe({
      next: (data) => {
        this.pdfs = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors du chargement des contrats PDF.';
        this.pdfs = [];
      }
    });
  }

  accepter(contratId: string): void {
    this.contratService.accepterContrat(contratId).subscribe({
      next: () => {
        this.successMessage = 'Contrat accepté avec succès.';
        this.errorMessage = '';
        this.loadPdfs();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err.message || 'Erreur lors de l’acceptation du contrat.';
      }
    });
  }

  refuser(contratId: string): void {
    this.contratService.refuserContrat(contratId).subscribe({
      next: () => {
        this.successMessage = 'Contrat refusé avec succès.';
        this.errorMessage = '';
        this.loadPdfs();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err.message || 'Erreur lors du refus du contrat.';
      }
    });
  }
}
