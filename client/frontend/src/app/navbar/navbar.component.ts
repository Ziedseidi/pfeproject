import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showCountries = false;
  showService = false;
  isLoginPage = false;  // Détecter si on est sur la page login

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Écouter les changements de route pour détecter la page active
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoginPage = this.router.url.includes('/login'); // Vérifie si l'URL contient '/login'
    });
  }

  onMouseEnter() {
    this.showCountries = true;
  }

  onMouseLeave() {
    this.showCountries = false;
  }

  onServiceMouseEnter() {
    this.showService = true;
  }

  onServiceMouseLeave() {
    this.showService = false;
  }

  selectCountry(country: string) {
    console.log(`Pays sélectionné: ${country}`);
    this.showCountries = false;
  }
}
