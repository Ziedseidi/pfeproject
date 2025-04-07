import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { User } from '../models/utilisateur.model';
import { Role } from '../models/role.model';

@Component({
  selector: 'app-liste-utilisateurs',
  templateUrl: './liste-utilisateurs.component.html',
  styleUrls: ['./liste-utilisateurs.component.css'],
})
export class ListeUtilisateursComponent implements OnInit {
  utilisateurs: User[] = [];
  filteredUtilisateurs: User[] = [];
  searchQuery: string = '';
  roles: Role[] = [];
  selectedRole: string = ''; // Valeur initiale vide
  errorMessage: string | null = null;
  isLoading: boolean = true;
  isEmailModalOpen: boolean = false;
  selectedUserId: string | null = null;
  isRoleModalOpen: boolean = false;

  constructor(
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.fetchUtilisateurs();
    this.fetchRoles();
  }

  fetchUtilisateurs(): void {
    this.isLoading = true;
    this.userService.getUsersWithDetails().subscribe(
      (data) => {
        this.utilisateurs = data;
        this.filteredUtilisateurs = data; // Initialisation avec tous les utilisateurs
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des utilisateurs.';
        this.isLoading = false;
      }
    );
  }

  fetchRoles(): void {
    this.roleService.getAllRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des rôles:', error);
      }
    );
  }

  filterUsers(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredUtilisateurs = this.utilisateurs.filter(
      (u) =>
        u.nom.toLowerCase().includes(query) ||
        u.prenom.toLowerCase().includes(query)
    );
  }

  assignRoleToUser(userId: string, roleId: string): void {
    if (userId && roleId) {  // Vérification si userId et roleId ne sont pas null ou vides
      this.roleService.assignRoleToUser(userId, roleId).subscribe(
        (response) => {
          alert('Rôle assigné avec succès!');
          this.fetchUtilisateurs(); // Mettre à jour la liste des utilisateurs après l'assignation
          this.closeRoleModal(); // Fermer la modale après l'assignation
        },
        (error) => {
          console.error('Erreur lors de l\'assignation du rôle:', error);
        }
      );
    } else {
      alert('Veuillez sélectionner un utilisateur et un rôle avant de l\'assigner.');
    }
  }

  supprimerUtilisateur(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.utilisateurs = this.utilisateurs.filter(u => u._id !== userId);
          this.filteredUtilisateurs = this.filteredUtilisateurs.filter(u => u._id !== userId);
        },
        (error) => {
          console.error('Erreur lors de la suppression de l’utilisateur :', error);
        }
      );
    }
  }

  toggleActivation(userId: string): void {
    this.userService.toggleUserActivation(userId).subscribe(
      () => {
        const user = this.utilisateurs.find(u => u._id === userId);
        if (user) {
          user.isActive = !user.isActive;
        }
      },
      (error) => {
        console.error('Erreur lors de l’activation/désactivation :', error);
      }
    );
  }

  openEmailModal(userId: string): void {
    this.selectedUserId = userId;
    this.isEmailModalOpen = true;
  }

  closeEmailModal(): void {
    this.isEmailModalOpen = false;
    this.selectedUserId = null;
  }

  openRoleModal(userId: string): void {
    this.selectedUserId = userId;
    this.isRoleModalOpen = true;
  }

  closeRoleModal(): void {
    this.isRoleModalOpen = false;
    this.selectedRole = ''; // Réinitialiser le rôle sélectionné
  }
}
