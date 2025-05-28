import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {

  user: any = {};
  isAddAffaireModal = false;
  isLoading = false;            // Pour le spinner
  isChatbotVisible = false;     // Pour afficher/masquer le chatbot

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(
      data => this.user = data,
      error => console.error('Erreur récupération user', error)
    );
  }

  openAddAffaireModal() {
    this.isAddAffaireModal = true;
  }

  closeAddAffaireModal() {
    this.isAddAffaireModal = false;
  }

  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
  }

  logout() {
    this.isLoading = true; // Active le spinner avant la déconnexion

    this.authService.logout().subscribe(
      response => {
        this.authService.clearToken();

        setTimeout(() => {
          this.router.navigate(['/login']);  // Redirection après 2 secondes
          this.isLoading = false;             // Désactive le spinner
        }, 2000);
      },
      error => {
        console.error('Erreur lors de la déconnexion', error);
        this.isLoading = false;
      }
    );
  }
}
