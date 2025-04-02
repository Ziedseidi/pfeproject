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
import { NewPasswordComponent } from './new-password/new-password.component'; // Composant pour réinitialisation du mot de passe
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'avocat-dashboard', component: AvocatDashboardComponent },
  { path: 'expert-dashboard', component: ExpertDashboardComponent },
  { path: 'client-dashboard', component: ClientDashboardComponent },
  { path: 'login', component: LoginComponent },

  // Route `register` avec ses enfants
  { 
    path: 'register', component: RegisterComponent, 
    children: [
      { path: 'form-avocat', component: FormAvocatComponent },
      { path: 'form-expert', component: FormExpertComponent },
      { path: 'form-client', component: FormClientComponent }
    ]
  },

  // Routes pour la réinitialisation du mot de passe
  { path: 'reset-password/:token', component: NewPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Route par défaut (redirection vers la page d'accueil)
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Importation des routes dans le module
  exports: [RouterModule]  // Exportation du module Router
})
export class AppRoutingModule { }
