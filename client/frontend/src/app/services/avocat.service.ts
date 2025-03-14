import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvocatService {
  private apiUrl = 'http://localhost:7501/avocat/register_Avocat'; // URL de ton backend

  constructor(private http: HttpClient) { }

  registerAvocat(avocatData: any): Observable<any> {
    console.log('Données envoyées au backend:', avocatData);  // Pour debugger
    return this.http.post(this.apiUrl, avocatData);
  }
}
