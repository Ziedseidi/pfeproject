import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-ajouter-role',
  templateUrl: './ajouter-role.component.html',
  styleUrls: ['./ajouter-role.component.css']
})
export class AjouterRoleComponent implements OnInit {
  roleForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private roleService: RoleService) {
    this.roleForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    const token = localStorage.getItem('token');
    console.log('Token dans localStorage :', token);  // Vérifie si le token est dans le localStorage
    
    if (!token) {
      this.message = 'Token manquant. Vous devez être connecté.';
      return;
    }

    if (this.roleForm.valid) {
      this.roleService.createRole(this.roleForm.value).subscribe({
        next: (res) => {
          this.message = res.message || 'Rôle créé avec succès!';
          this.roleForm.reset();
        },
        error: (err) => {
          this.message = err.error.message || 'Une erreur est survenue. Veuillez réessayer.';
          console.error('Erreur lors de l\'ajout du rôle :', err);
        }
      });
    } else {
      this.message = 'Formulaire invalide, veuillez remplir tous les champs.';
    }
  }
}
