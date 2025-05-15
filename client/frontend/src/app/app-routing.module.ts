import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormAvocatComponent } from './form-avocat/form-avocat.component';
import { FormClientComponent } from './form-client/form-client.component';
import { FormExpertComponent } from './form-expert/form-expert.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AvocatDashboardComponent } from './avocat-dashboard/avocat-dashboard.component';
import { ExpertDashboardComponent } from './expert-dashboard/expert-dashboard.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { AjouterRoleComponent } from './ajouter-role/ajouter-role.component';
import { ListeRolesComponent } from './liste-roles/liste-roles.component';
import { ListeUtilisateursComponent } from './liste-utilisateurs/liste-utilisateurs.component';
import { TribunalComponent } from './tribunal/tribunal.component';
import { TribunalListComponent } from './tribunal-list/tribunal-list.component';
import { ListAvocatsComponent } from './list-avocats/list-avocats.component';
import { AddAffaireComponent } from './add-affaire/add-affaire.component';
import { ListAffairesComponent } from './list-affaires/list-affaires.component';
import { RechercheAffaireComponent } from './recherche-affaire/recherche-affaire.component';
import { ConsignationAffaireComponent } from './consignation-affaire/consignation-affaire.component';
import { SaisieAffaireComponent } from './saisie-affaire/saisie-affaire.component';
import { ContratComponent } from './contrat/contrat.component';
import { DossiersComponent } from './dossiers/dossiers.component';
import { DossierDetailComponent } from './dossier-detail/dossier-detail.component'; // Importer le composant
import { MesAffairesListeComponent } from './mes-affaires-liste/mes-affaires-liste.component';
import { AffaireJugementComponent } from './affaire-jugement/affaire-jugement.component';
import { AjouterDossierComponent } from './ajouter-dossier/ajouter-dossier.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // Routes pour le tableau de bord Admin
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    children: [
      { path: 'liste-utilisateurs', component: ListeUtilisateursComponent },
      { path: 'add-role', component: AjouterRoleComponent },
      { path: 'liste-roles', component: ListeRolesComponent }, 
      { path: 'liste-tribunaux', component: TribunalListComponent },
      { path: 'list-avocats', component: ListAvocatsComponent }
    ]
  },
  
  // Routes pour les tableaux de bord de différents rôles
  { 
    path: 'avocat-dashboard', 
    component: AvocatDashboardComponent,
    children: [
      { path: 'mes-affaires-liste', component: MesAffairesListeComponent },
      {path:'ajouter-dossier',component:AjouterDossierComponent}
      // Ajoutez d'autres routes pour l'avocat ici si nécessaire
    ]
  },
  { path: 'expert-dashboard', component: ExpertDashboardComponent },
  { path: 'client-dashboard', component: ClientDashboardComponent },
  
  // Routes pour les affaires
  { path: 'list-affaires', component: ListAffairesComponent },
  { path: 'contrat', component: ContratComponent },
  { path: 'recherche-affaire', component: RechercheAffaireComponent },
  { path: 'consignation-affaire', component: ConsignationAffaireComponent },
  { path: 'saisie-affaire', component: SaisieAffaireComponent },
{ path: 'affaire-jugement', component: AffaireJugementComponent },

  
  // Route pour la liste des dossiers
  { path: 'dossiers', component: DossiersComponent },
  
  // Route pour les détails d'un dossier
  { path: 'dossier/:id', component: DossierDetailComponent }, // Route dynamique pour l'ID du dossier
  
  // Routes pour la gestion des utilisateurs
  { path: 'login', component: LoginComponent },
  { 
    path: 'register', 
    component: RegisterComponent, 
    children: [
      { path: 'form-avocat', component: FormAvocatComponent },
      { path: 'form-expert', component: FormExpertComponent },
      { path: 'form-demandeur', component: FormClientComponent },
    ]
  },
  
  // Routes pour la gestion du mot de passe
  { path: 'reset-password/:token', component: NewPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Route pour rediriger les utilisateurs vers la page d'accueil si la route n'existe pas
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
