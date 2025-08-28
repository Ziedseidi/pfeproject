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

  notifications: any[] = [];
  hasNewNotifications = false;
  showNotificationPanel = false;

  constructor(
    private authService: AuthService,
    private contratService: ContratService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Erreur récupération user', err)
    });

    this.loadNotifications();
  }

  loadNotifications() {
    this.contratService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;

        // Récupérer les IDs des notifications déjà vues depuis localStorage
        const viewedJson = localStorage.getItem('notificationsViewedIds');
        const viewedIds: string[] = viewedJson ? JSON.parse(viewedJson) : [];

        // Vérifier si au moins une notification n’a pas été vue
        const hasUnread = this.notifications.some(notif => !viewedIds.includes(notif._id));

        this.hasNewNotifications = hasUnread;
      },
      error: (err) => console.error('Erreur chargement notifications', err)
    });
  }

  toggleNotifications() {
    this.showNotificationPanel = !this.showNotificationPanel;

    if (this.showNotificationPanel) {
      // Quand on ouvre le panneau, marquer toutes les notifications comme vues
      const allIds = this.notifications.map(notif => notif._id);
      localStorage.setItem('notificationsViewedIds', JSON.stringify(allIds));
      this.hasNewNotifications = false;
    }
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
}
