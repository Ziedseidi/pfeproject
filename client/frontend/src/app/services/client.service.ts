import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class clientService {
  private apiUrl = 'http://localhost:7501/client/register_Client'; // URL de ton backend

  constructor(private http: HttpClient) { }

  registerClient(clientData: any): Observable<any> {
    console.log('Données envoyées au backend:', clientData);  // Pour debugger
    return this.http.post(this.apiUrl, clientData);
  }
}
