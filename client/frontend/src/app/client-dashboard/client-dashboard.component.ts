import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {

  user: any = {};
  isAddAffaireModal = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(
      (data) => this.user = data,
      (error) => console.error('Erreur récupération user', error)
    );
  }

  openAddAffaireModal() {
    this.isAddAffaireModal = true;
  }

  closeAddAffaireModal() {
    this.isAddAffaireModal = false;
  }

  logout() {
    // votre logique de déconnexion ici
  }
}
