import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent {
  @Input() userId: string | null = null; // ID de l'utilisateur sélectionné
  @Output() closeModal = new EventEmitter<void>(); // Émettre un événement pour fermer le modal

  subject: string = ''; // Sujet de l'email
  emailContent: string = ''; // Contenu de l'email
  isSuccess: boolean = false; // Variable pour afficher un message de succès

  constructor() {}

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    if (this.subject && this.emailContent) {
      // Logique pour envoyer l'email ici
      console.log(`Envoyer un email à l'utilisateur ${this.userId} avec le sujet "${this.subject}" et le contenu: "${this.emailContent}"`);

      // Simuler l'envoi d'un email (à remplacer par ton service réel)
      setTimeout(() => {
        this.isSuccess = true; // Afficher le message de succès
        setTimeout(() => {
          this.isSuccess = false; // Masquer le message après 3 secondes
        }, 3000);
      }, 500); // Simulation de délai d'envoi

      // Fermer le modal après soumission
      this.closeModal.emit();
    } else {
      console.log('Le sujet et le contenu de l\'email sont obligatoires.');
    }
  }

  // Méthode pour fermer le modal
  close(): void {
    this.closeModal.emit(); // Émettre un événement pour fermer le modal
  }
}
