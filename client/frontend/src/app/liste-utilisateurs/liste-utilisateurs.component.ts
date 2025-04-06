import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/utilisateur.model';

@Component({
  selector: 'app-liste-utilisateurs',
  templateUrl: './liste-utilisateurs.component.html',
  styleUrls: ['./liste-utilisateurs.component.css'],
})
export class ListeUtilisateursComponent implements OnInit {
  utilisateurs: User[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = true;  // Indicateur de chargement des données

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUtilisateurs(); // Méthode pour récupérer les utilisateurs
  }

  // Récupérer les utilisateurs avec gestion des erreurs
  fetchUtilisateurs(): void {
    this.isLoading = true;  // Lancer le chargement
    this.userService.getUsersWithDetails().subscribe(
      (data) => {
        this.utilisateurs = data;  // Assigner les utilisateurs récupérés à 'utilisateurs'
        this.isLoading = false;  // Fin du chargement
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des utilisateurs.';  // Message d'erreur
        console.error('Erreur récupérée :', error);
        this.isLoading = false;  // Fin du chargement même en cas d'erreur
      }
    );
  }
}
