import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  cards = [
    { title: 'Réclamations' ,content:' Déposez et suivez vos réclamations en toute simplicité. Recevez des mises à jour en temps réel sur le traitement de votre demande.'
      , date: 'April 15, 2022' },
    { title: 'Suivi dossier', content:' Suivez l\'évolution de votre dossier en temps réel, avec un accès sécurisé aux mises à jour, documents et décisions liées à votre affaire '
      , date: 'April 16, 2022' },
    {title : 'Contrats', content:' Contrat de collaboration signé pour une durée déterminée, définissant les obligations et droits des parties concernées'
      , date:'Aplril 16, 2022'}

  ];

  constructor(private router: Router) {}

  navigateTo(formType: string): void {
    if (formType === 'avocat') {
      this.router.navigate(['/form-avocat']);
    } else if (formType === 'client') {
      this.router.navigate(['/form-client']);
    } else if (formType === 'expert') {
      this.router.navigate(['/form-expert']);
    }
  }
}
