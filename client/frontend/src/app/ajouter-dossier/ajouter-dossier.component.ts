import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DossierService } from '../services/dossier.service';  // adapte le chemin selon ta structure

@Component({
  selector: 'app-ajouter-dossier',
  templateUrl: './ajouter-dossier.component.html',
  styleUrls: ['./ajouter-dossier.component.css']
})
export class AjouterDossierComponent {

  dossierForm: FormGroup;
  selectedFiles: File[] = [];
  fileError: string = '';
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private dossierService: DossierService
  ) {
    this.dossierForm = this.fb.group({
      numeroAffaire: ['', Validators.required],
      titre: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onFileChange(event: Event) {
    this.fileError = '';
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    // Optionnel : limite nombre de fichiers, types, etc.
    if (files.length === 0) {
      this.fileError = 'Aucun fichier sélectionné.';
      return;
    }

    // On évite les doublons
    files.forEach(file => {
      if (!this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        this.selectedFiles.push(file);
      }
    });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    this.message = '';
    if (this.dossierForm.invalid) {
      this.message = 'Veuillez remplir tous les champs obligatoires.';
      this.dossierForm.markAllAsTouched();
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.message = 'Veuillez sélectionner au moins un fichier.';
      return;
    }

    const formValue = this.dossierForm.value;

    this.dossierService.ajouterDossier({
      numeroAffaire: formValue.numeroAffaire,
      titre: formValue.titre,
      description: formValue.description,
      imagesFichier: this.selectedFiles
    }).subscribe({
      next: (res) => {
        this.message = 'Dossier ajouté avec succès !';
        this.dossierForm.reset();
        this.selectedFiles = [];
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Erreur lors de l\'ajout du dossier.';
      }
    });
  }
}
