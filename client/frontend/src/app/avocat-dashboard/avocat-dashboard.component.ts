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
  isLoading = false;  // Variable pour gérer le spinner

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

  logout() {
    this.isLoading = true; // Active le spinner avant la déconnexion
  
    this.authService.logout().subscribe(
      (response) => {
        this.authService.clearToken();
  
        // Affiche le spinner pendant 3 secondes
        setTimeout(() => {
          this.router.navigate(['/login']);  // Redirection après 3 secondes
          this.isLoading = false;  // Désactive le spinner après 3 secondes
        }, 2000);  // 3000 ms = 3 secondes
      },
      (error) => {
        console.error('Erreur lors de la déconnexion', error);
        this.isLoading = false;  // Désactive le spinner même en cas d'erreur
      }
    );
  }
}



