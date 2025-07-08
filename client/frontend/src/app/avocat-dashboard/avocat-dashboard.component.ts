import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avocat-dashboard',
  templateUrl: './avocat-dashboard.component.html',
  styleUrls: ['./avocat-dashboard.component.css']
})
export class AvocatDashboardComponent {
  user: any = {};
  isAddAffaireModal = false;
  isLoading = false;  // Pour gérer le spinner

  isChatbotVisible = false;  // ✅ Ajout pour ton bouton chatbot

  constructor(private authService: AuthService, private router: Router) {}

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

  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
  }

  logout() {
    this.isLoading = true; // Active le spinner avant la déconnexion

    this.authService.logout().subscribe(
      () => {
        this.authService.clearToken();
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.isLoading = false;
        }, 2000);
      },
      (error) => {
        console.error('Erreur lors de la déconnexion', error);
        this.isLoading = false;
      }
    );
  }
}
