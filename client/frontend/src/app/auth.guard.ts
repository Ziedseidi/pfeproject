import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // ✅ Utilisateur authentifié
      return true;
    } else {
      // ⛔️ Pas de token → Redirection vers login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
