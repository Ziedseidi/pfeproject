import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.message = "Email et mot de passe sont requis.";
      return;
    }

    this.isLoading = true;
    this.message = ''; // Réinitialiser le message d'erreur

    timer(2000).subscribe(() => {
      this.authService.login(this.email, this.password).subscribe({
        next: (response: any) => {
          this.isLoading = false;

          // Enregistrer le token dans localStorage après une connexion réussie
          if (response.token) {
            this.authService.saveToken(response.token); // Utiliser la méthode saveToken
          }

          // Redirection en fonction du rôle
          const role = response.user.role;
          if (role === 'Admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (role === 'Avocat') {
            this.router.navigate(['/avocat-dashboard']);
          } else if (role === 'Expert') {
            this.router.navigate(['/expert-dashboard']);
          } else {
            this.router.navigate(['/client-dashboard']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.status === 403 && error.error.message === "Votre compte n'est pas encore activé.") {
            this.message = "Votre compte n'est pas encore activé.";
          } else {
            this.message = error.error.message || 'Erreur de connexion.';
          }
        }
      });
    });
  }

  
}
