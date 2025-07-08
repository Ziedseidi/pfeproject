import { Component } from '@angular/core';
import { PasswordResetService } from '../services/password-reset.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  isLoading: boolean = false;

  constructor(private passwordResetService: PasswordResetService) {}

  onSubmit(): void {
    if (!this.email) {
      this.message = 'Veuillez entrer un email.';
      return;
    }

    this.isLoading = true;
    this.passwordResetService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message = 'Un email de réinitialisation a été envoyé.';
      },
      error: (error) => {
        this.isLoading = false;
        this.message = 'Utilisateur non touvé.';
      }
    });
  }
}
