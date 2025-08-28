import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../services/user.service'; // Importer ton service

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent {
  @Input() userId: string | null = null; 
  @Output() closeModal = new EventEmitter<void>();

  subject: string = ''; 
  emailContent: string = ''; 
  isSuccess: boolean = false;

  constructor(private userService: UserService) {}

  onSubmit(): void {
    if (!this.userId) {
      console.error('Utilisateur non sélectionné.');
      return;
    }

    if (!this.subject.trim() || !this.emailContent.trim()) {
      console.warn('Le sujet et le contenu de l\'email sont obligatoires.');
      return;
    }

    // Appel réel à ton service
    this.userService.sendEmail(this.userId, this.subject, this.emailContent).subscribe(
      () => {
        this.isSuccess = true;
        setTimeout(() => this.isSuccess = false, 3000);
        this.closeModal.emit(); // fermer modal
      },
      (error) => {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        alert('Erreur lors de l\'envoi de l\'email ❌');
      }
    );
  }

  close(): void {
    this.closeModal.emit();
  }
}
