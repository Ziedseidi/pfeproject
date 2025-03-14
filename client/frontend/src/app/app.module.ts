import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Assurez-vous que FormsModule est importé
import { HttpClientModule } from '@angular/common/http';  // Assurez-vous que HttpClientModule est importé
import { AppRoutingModule } from './app-routing.module';  // Assurez-vous que AppRoutingModule est importé
import { RouterModule } from '@angular/router';  // Ajoutez cette ligne pour RouterModule
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
import { SpinnerComponent } from './spinner/spinner.component';


import { NavbarComponent } from './navbar/navbar.component';

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
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  // AppRoutingModule est correctement importé ici
    RouterModule,      // Importez RouterModule ici pour activer routerLink
    FormsModule,       // Assurez-vous que FormsModule est bien importé
    HttpClientModule   // Assurez-vous que HttpClientModule est bien importé
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
