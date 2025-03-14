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

    this.isLoading = true;  // Afficher le spinner immédiatement
    timer(2000).subscribe(() => {  // Ajouter un délai de 2 secondes
      this.authService.login(this.email, this.password).subscribe({
        next: (response: any) => {
          this.isLoading = false;  // Cacher le spinner après la réponse
          console.log(response);

          const role = response.user.role;
          
          // Rediriger en fonction du rôle
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
          this.isLoading = false;  // Cacher le spinner en cas d'erreur
          this.message = error.error.message || 'Erreur de connexion.';
          console.error(error);
        }
      });
    });
  }
}
