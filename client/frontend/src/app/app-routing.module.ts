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
import { TribunalListComponent } from './tribunal-list/tribunal-list.component';
import { ListAvocatsComponent } from './list-avocats/list-avocats.component';
import { AddAffaireComponent } from './add-affaire/add-affaire.component';
import { ListAffairesComponent } from './list-affaires/list-affaires.component';
import { RechercheAffaireComponent } from './recherche-affaire/recherche-affaire.component';
import { ConsignationAffaireComponent } from './consignation-affaire/consignation-affaire.component';
import { SaisieAffaireComponent } from './saisie-affaire/saisie-affaire.component';
import { ContratComponent } from './contrat/contrat.component';
import { DossiersComponent } from './dossiers/dossiers.component';
import { DossierDetailComponent } from './dossier-detail/dossier-detail.component';
import { MesAffairesListeComponent } from './mes-affaires-liste/mes-affaires-liste.component';
import { AffaireJugementComponent } from './affaire-jugement/affaire-jugement.component';
import { AjouterDossierComponent } from './ajouter-dossier/ajouter-dossier.component';
import { ContratPdfComponent } from './contrat-pdf/contrat-pdf.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChatbotJuridiqueComponent } from './chatbot-juridique/chatbot-juridique.component';
import { AuthGuard } from './auth.guard';
import { PayerConsignationComponent } from './payer-consignation/payer-consignation.component';
import { PayerSaisieComponent } from './payer-saisie/payer-saisie.component';
import { FactureComponent } from './facture/facture.component';
import { AvocatAffaireComponent } from './avocat-affaire/avocat-affaire.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  // Admin Dashboard avec children
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: StatisticsComponent },
      { path: 'liste-utilisateurs', component: ListeUtilisateursComponent },
      { path: 'add-role', component: AjouterRoleComponent },
      { path: 'liste-roles', component: ListeRolesComponent },
      { path: 'liste-tribunaux', component: TribunalListComponent },
      { path: 'list-avocats', component: ListAvocatsComponent }
    ]
  },

  // Avocat Dashboard
  {
    path: 'avocat-dashboard',
    component: AvocatDashboardComponent,
    canActivate: [AuthGuard]
  },

  { path: 'mes-affaires-liste', component: MesAffairesListeComponent },
  { path: 'ajouter-dossier', component: AjouterDossierComponent },
  { path: 'Pdfs', component: ContratPdfComponent },
  { path: 'paiement-consignation', component: PayerConsignationComponent },
  { path: 'paiement-saisie', component: PayerSaisieComponent },
  { path: 'factures', component: FactureComponent },

  // Expert Dashboard
  { path: 'expert-dashboard', component: ExpertDashboardComponent, canActivate: [AuthGuard] },

  // Client Dashboard (pas de children)
  { path: 'client-dashboard', component: ClientDashboardComponent, canActivate: [AuthGuard] },

  { path: 'list-affaires', component: ListAffairesComponent, canActivate: [AuthGuard] },
  {path:'avocats',component:AvocatAffaireComponent, canActivate:[AuthGuard]},
  { path: 'contrat', component: ContratComponent, canActivate: [AuthGuard] },
  { path: 'recherche-affaire', component: RechercheAffaireComponent, canActivate: [AuthGuard] },
  { path: 'consignation-affaire', component: ConsignationAffaireComponent, canActivate: [AuthGuard] },
  { path: 'saisie-affaire', component: SaisieAffaireComponent, canActivate: [AuthGuard] },
  { path: 'affaire-jugement', component: AffaireJugementComponent, canActivate: [AuthGuard] },
  { path: 'chatbot', component: ChatbotJuridiqueComponent, canActivate: [AuthGuard] },

  // Dossiers
  { path: 'dossiers', component: DossiersComponent, canActivate: [AuthGuard] },
  { path: 'dossier/:id', component: DossierDetailComponent, canActivate: [AuthGuard] },

  // Authentification
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
    children: [
      { path: 'form-avocat', component: FormAvocatComponent },
      { path: 'form-expert', component: FormExpertComponent },
      { path: 'form-demandeur', component: FormClientComponent }
    ]
  },

  // Mot de passe
  { path: 'reset-password/:token', component: NewPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // 404 → Home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
