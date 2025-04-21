import { Component } from '@angular/core';
import { AffaireService } from '../services/affaire.service';

@Component({
  selector: 'app-add-affaire',
  templateUrl: './add-affaire.component.html',
  styleUrls: ['./add-affaire.component.css']
})
export class AddAffaireComponent {
  affaire = {
    numeroAffaire: '',
    objet: '',
    tribunal: '',
    dateConvocation: null,
    degreJuridique: '',
    dateCloture: null,
    clotureApresReception: false,
    remarques: '',
    reclamation: { type: '' },
    typeClient: '',
    numeroVol: '',
    dateVol: null
  };

  constructor(private affaireService: AffaireService) {}

  onSubmit() {
    const payload = this.cleanPayload(this.affaire);
    this.affaireService.addAffaire(payload).subscribe({
      next: res => {
        alert('Affaire ajoutée avec succès !');
        console.log(res);
        this.closeAddAffaireModal();
      },
      error: err => {
        console.error(err);
        alert("Erreur lors de l'ajout de l'affaire.");
      }
    });
  }

  cleanPayload(obj: any): any {
    const cleaned: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nested = this.cleanPayload(value);
        if (Object.keys(nested).length > 0) cleaned[key] = nested;
      } else if (value !== null && value !== '' && value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  closeAddAffaireModal() {
    const modal = document.getElementById('addAffaireModal');
    if (modal) modal.style.display = 'none';
  }
}
