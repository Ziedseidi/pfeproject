import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from '../services/password-reset.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  isTokenValid: boolean = false; 
  token: string = ''; 
  message: string = ''; 
  showResetPasswordForm: boolean = false; // Affiche ou non le formulaire de réinitialisation

  constructor(
    private route: ActivatedRoute,
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tokenFromUrl = params.get('token');
      if (tokenFromUrl) {
        this.token = tokenFromUrl;

        this.passwordResetService.validateToken(this.token).subscribe(
          (response) => {
            console.log(' Réponse du backend :', response);
            this.isTokenValid = true; // Si le token est valide, on affiche le formulaire
            this.showResetPasswordForm = true;
          },
          (error) => {
            console.log(' Erreur :', error);
            this.message = error.error.message || "Token invalide ou expiré";
          }
        );
      }
    });
  }

  // 3️⃣ Méthode pour réinitialiser le mot de passe
  resetPassword(newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) {
      this.message = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.passwordResetService.resetPassword(this.token, newPassword, confirmPassword).subscribe(
      (response) => {
        alert('Mot de passe réinitialisé avec succès');
        this.router.navigate(['/login']); // Redirige vers la page de connexion après réinitialisation
      },
      (error) => {
        this.message = 'Erreur lors de la réinitialisation du mot de passe';
      }
    );
  }
}
