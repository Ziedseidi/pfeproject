// chemin : src/app/components/notifications/notifications.component.ts

import { Component, OnInit } from '@angular/core';
import { ContratService } from '../services/contrat.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private contratService: ContratService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.contratService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: (err) => {
        console.error('Erreur chargement notifications :', err);
      }
    });
  }
}
