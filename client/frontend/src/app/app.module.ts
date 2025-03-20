import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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

import { NavbarComponent } from './navbar/navbar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { CardComponent } from './card/card.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RegisterComponent } from './components/register/register.component';

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
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    RecaptchaModule
  ],
  providers: [DatePipe],  // Ajoute DatePipe ici pour qu'il soit disponible dans le composant
  bootstrap: [AppComponent]
})
export class AppModule { }
