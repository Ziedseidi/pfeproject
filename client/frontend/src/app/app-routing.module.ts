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

// 👇 Import du composant AddRole
import { AjouterRoleComponent } from './ajouter-role/ajouter-role.component';
import { ListeRolesComponent } from './liste-roles/liste-roles.component';
import { ListeUtilisateursComponent } from './liste-utilisateurs/liste-utilisateurs.component';
import { TribunalComponent } from './tribunal/tribunal.component';
import { TribunalListComponent } from './tribunal-list/tribunal-list.component';
import { ListAvocatsComponent } from './list-avocats/list-avocats.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
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
  { path: 'avocat-dashboard', component: AvocatDashboardComponent },
  { path: 'expert-dashboard', component: ExpertDashboardComponent },
  { path: 'client-dashboard', component: ClientDashboardComponent },
  { path: 'login', component: LoginComponent },

  // Routes d'enregistrement
  { 
    path: 'register', component: RegisterComponent, 
    children: [
      { path: 'form-avocat', component: FormAvocatComponent },
      { path: 'form-expert', component: FormExpertComponent },
      { path: 'form-demandeur', component: FormClientComponent },
    ]
  },

  // Routes de réinitialisation du mot de passe
  { path: 'reset-password/:token', component: NewPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Redirection par défaut
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
