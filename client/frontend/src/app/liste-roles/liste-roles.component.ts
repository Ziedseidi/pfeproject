import { Component, OnInit } from '@angular/core';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-liste-roles',
  templateUrl: './liste-roles.component.html',
  styleUrls: ['./liste-roles.component.css']
})
export class ListeRolesComponent implements OnInit {
  roles: any[] = [];
  message: string = '';

  isPopupOpen: boolean = false;
  selectedRole: any = {
    _id: '',
    nom: '',
    description: ''
  };

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des rôles', err);
        this.message = 'Erreur lors de la récupération des rôles';
      }
    });
  }

  onDelete(roleId: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce rôle ?')) {
      this.roleService.deleteRole(roleId).subscribe({
        next: () => {
          this.message = 'Rôle supprimé avec succès';
          this.fetchRoles();
        },
        error: (err: any) => {
          console.error('Erreur lors de la suppression', err);
          this.message = 'Erreur lors de la suppression du rôle';
        }
      });
    }
  }

  onEdit(role: any): void {
    this.selectedRole = { ...role };
    this.isPopupOpen = true;
  }

  updateRole(): void {
    if (this.selectedRole._id) {
      this.roleService.updateRole(this.selectedRole._id, {
        nom: this.selectedRole.nom,
        description: this.selectedRole.description
      }).subscribe({
        next: () => {
          this.message = 'Rôle mis à jour avec succès';
          this.fetchRoles();
          this.closePopup();
        },
        error: (err: any) => {
          console.error('Erreur lors de la mise à jour du rôle', err);
          this.message = 'Erreur lors de la mise à jour du rôle';
        }
      });
    }
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.selectedRole = {
      _id: '',
      nom: '',
      description: ''
    };
  }
}
