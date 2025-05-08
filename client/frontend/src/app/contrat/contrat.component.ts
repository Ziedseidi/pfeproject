import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContratService } from '../services/contrat.service'; // Importer le service

@Component({
  selector: 'app-contrat',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.css']
})
export class ContratComponent implements OnInit {

  contratForm: FormGroup;

  pdfUrl: string | undefined;
  pdfGenerated: boolean = false;

  constructor(private fb: FormBuilder, private contratService: ContratService) { 
    // Initialisation du formulaire avec les champs du template
    this.contratForm = this.fb.group({
      avocatNom: ['', Validators.required],
      avocatPrenom: ['', Validators.required],
      demandeurNom: ['', Validators.required],
      demandeurPrenom: ['', Validators.required],
      numeroAffaire: [[], Validators.required],
      objet: ['', Validators.required],
      montant: ['', Validators.required],
      direction: [''],
      dateSignature: ['', Validators.required],
      dateEffet: ['', Validators.required],
      duree: [''],
      dateFin: [''],
      datePreavis: ['']
    });
  }

  ngOnInit(): void {
    // Récupération des valeurs initiales ou autres tâches
  }

  onSubmit(): void {
    if (this.contratForm.valid) {
      this.contratService.createContrat(this.contratForm.value).subscribe(
        (response) => {
          console.log('Contrat créé avec succès', response);

          // Vérifier si la réponse contient le champ 'fichier' et l'assigner à pdfUrl
          if (response && response.fichier) {
            this.pdfUrl = response.fichier;
            this.pdfGenerated = true;
          } else {
            console.error('Le fichier n\'a pas été retourné dans la réponse.');
          }
        },
        (error) => {
          console.error('Erreur lors de la création du contrat', error);
        }
      );
    }
  }

  getPdfUrl(): string {
    // Vérification pour éviter l'erreur si pdfUrl est undefined
    if (this.pdfUrl) {
      return `http://localhost:7501/pdfs/${this.pdfUrl}`;
    } else {
      return ''; // Retourne une chaîne vide si pdfUrl n'est pas défini
    }
  }
}
