import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';  // Ajoute cette ligne pour l'importation de Router


@Component({
  selector: 'app-nav-classic',
  templateUrl: './nav-classic.component.html',
  styleUrls: ['./nav-classic.component.css']
})
export class NavClassicComponent {
  isLoading = false; // ← déclaration manquante ajoutée ici

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.isLoading = true;

    this.authService.logout().subscribe(
      (response) => {
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
