import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Importez le service AuthService

@Component({
  selector: 'app-sidbar-general',
  templateUrl: './sidbar-general.component.html',
  styleUrls: ['./sidbar-general.component.css']
})
export class SidbarGeneralComponent implements OnInit {

  user: any = {};  // Pour stocker les informations de l'utilisateur

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Appelez le service pour récupérer les informations de l'utilisateur
    this.authService.getUserInfo().subscribe(
      (data) => {
        this.user = data;  // Assignez les données à l'objet 'user'
      },
      (error) => {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur', error);
      }
    );
  }
}
