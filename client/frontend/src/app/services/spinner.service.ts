import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false); // Etat initial du spinner (non affiché)
  isLoading$ = this.isLoadingSubject.asObservable(); // Observable pour l'abonnement

  constructor() {}

  // Méthode pour afficher le spinner
  showSpinner() {
    this.isLoadingSubject.next(true);  // Met à true pour afficher le spinner
  }

  // Méthode pour masquer le spinner
  hideSpinner() {
    this.isLoadingSubject.next(false); // Met à false pour masquer le spinner
  }
}
