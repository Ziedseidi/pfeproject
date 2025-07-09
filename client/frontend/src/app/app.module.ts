import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Utilisé pour les formulaires basés sur template-driven
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormAvocatComponent } from './form-avocat/form-avocat.component';
import { FormClientComponent } from './form-client/form-client.component';
import { FormExpertComponent } from './form-expert/form-expert.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AvocatDashboardComponent } from './avocat-dashboard/avocat-dashboard.component';
import { ExpertDashboardComponent } from './expert-dashboard/expert-dashboard.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { DatePipe } from '@angular/common';  // Assurez-vous que DatePipe est importé
import { MatIconModule } from '@angular/material/icon';

import { NavbarComponent } from './navbar/navbar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { CardComponent } from './card/card.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RegisterComponent } from './components/register/register.component';

// Importation de ReactiveFormsModule pour utiliser les formulaires réactifs
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { SidbarGeneralComponent } from './sidbar-general/sidbar-general.component';
import { NavClassicComponent } from './nav-classic/nav-classic.component';
import { AjouterRoleComponent } from './ajouter-role/ajouter-role.component';
import { ListeRolesComponent } from './liste-roles/liste-roles.component';
import { ListeUtilisateursComponent } from './liste-utilisateurs/liste-utilisateurs.component';
import { SendEmailComponent } from './send-email/send-email.component';
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
import { DossierDetailComponent } from './dossier-detail/dossier-detail.component';
import { MesAffairesListeComponent } from './mes-affaires-liste/mes-affaires-liste.component';
import { AffaireJugementComponent } from './affaire-jugement/affaire-jugement.component';
import { AjouterDossierComponent } from './ajouter-dossier/ajouter-dossier.component';
import { ContratPdfComponent } from './contrat-pdf/contrat-pdf.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './chart/chart.component';
import { ChatbotJuridiqueComponent } from './chatbot-juridique/chatbot-juridique.component';
import { InfoJurediqueComponent } from './info-juredique/info-juredique.component';
import { InfoJurediqueAvocatComponent } from './info-juredique-avocat/info-juredique-avocat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FormAvocatComponent,
    FormClientComponent,
    FormExpertComponent,
    ClientFormComponent,
    LoginComponent,
    AdminDashboardComponent,
    AvocatDashboardComponent,
    ExpertDashboardComponent,
    ClientDashboardComponent,
    SpinnerComponent,
    NavbarComponent,
    CardComponent,
    FooterComponent,
    NavComponent,
    SidebarComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    SidbarGeneralComponent,
    NavClassicComponent,
    AjouterRoleComponent,
    ListeRolesComponent,
    ListeUtilisateursComponent,
    SendEmailComponent,
    TribunalComponent,
    TribunalListComponent,
    ListAvocatsComponent,
    AddAffaireComponent,
    ListAffairesComponent,
    RechercheAffaireComponent,
    ConsignationAffaireComponent,
    SaisieAffaireComponent,
    ContratComponent,
    DossiersComponent,
    DossierDetailComponent,
    MesAffairesListeComponent,
    AffaireJugementComponent,
    AjouterDossierComponent,
    ContratPdfComponent,
    StatisticsComponent,
    ChartComponent,
    ChatbotJuridiqueComponent,
    InfoJurediqueComponent,
    InfoJurediqueAvocatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,  // Si vous utilisez des formulaires basés sur template-driven
    ReactiveFormsModule,  // Ajoutez ReactiveFormsModule ici
    HttpClientModule,
    MatIconModule,  
    NgChartsModule,
  ],
  providers: [DatePipe],  // Ajoute DatePipe ici pour qu'il soit disponible dans le composant
  bootstrap: [AppComponent]
})
export class AppModule { }
