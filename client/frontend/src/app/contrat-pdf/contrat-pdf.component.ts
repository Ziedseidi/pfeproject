import { Component, OnInit } from '@angular/core';
import { ContratService, PdfContrat } from '../services/contrat.service';

@Component({
  selector: 'app-contrat-pdf',
  templateUrl: './contrat-pdf.component.html',
  styleUrls: ['./contrat-pdf.component.css']
})
export class ContratPdfComponent implements OnInit {
  pdfs: PdfContrat[] = [];  // tableau d'objets { url, numeroAffaire }
  errorMessage: string = '';

  constructor(private contratService: ContratService) {}

  ngOnInit(): void {
    this.loadPdfs();
  }

  loadPdfs(): void {
    this.contratService.getPdfContrats().subscribe({
      next: (data) => {
        this.pdfs = data;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors du chargement des PDFs.';
      }
    });
  }
  
}
