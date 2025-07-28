import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ContratService } from '../services/contrat.service';

@Component({
  selector: 'app-avocat-dashboard',
  templateUrl: './avocat-dashboard.component.html',
  styleUrls: ['./avocat-dashboard.component.css']
})
export class AvocatDashboardComponent implements OnInit {
  user: any = {};
  isAddAffaireModal = false;
  isLoading = false;
  isChatbotVisible = false;

  // ✅ Notifications
  notifications: any[] = [];

  constructor(
    private authService: AuthService,
    private contratService: ContratService, // ✅ injecter
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Erreur récupération user', err)
    });

    this.loadNotifications(); // ✅ charger au démarrage
  }

  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
  }

  logout() {
    this.isLoading = true;
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearToken();
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.isLoading = false;
        }, 2000);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // ✅ Méthode pour charger les notifications
  loadNotifications() {
    this.contratService.getNotifications().subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error('Erreur chargement notifications', err)
    });
  }

  // ✅ Navigue vers le composant notifications
  toggleNotifications() {
    this.router.navigate(['/notifications']);
  }
}
