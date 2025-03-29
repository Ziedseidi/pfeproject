import { Component } from '@angular/core';

@Component({
  selector: 'app-sidbar-general',
  templateUrl: './sidbar-general.component.html',
  styleUrls: ['./sidbar-general.component.css']
})
export class SidbarGeneralComponent {

  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  logout() {
    // Logique de déconnexion
    console.log('Logging out...');
  }

}
