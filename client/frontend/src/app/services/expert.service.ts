import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  private apiUrl = 'http://localhost:7501/expert/register_Expert'; // URL de ton backend

  constructor(private http: HttpClient) { }

  registerExpert(expertData: any): Observable<any> {
    console.log('Données envoyées au backend:', expertData);  // Pour debugger
    return this.http.post(this.apiUrl, expertData);
  }
}
