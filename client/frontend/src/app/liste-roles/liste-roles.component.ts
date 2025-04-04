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
          this.fetchRoles(); // Recharge la liste après suppression
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.message = 'Erreur lors de la suppression du rôle';
        }
      });
    }
  }

  onEdit(roleId: string): void {
    // Tu peux rediriger ou ouvrir un formulaire ici
    console.log('Modifier le rôle avec ID :', roleId);
  }
}
