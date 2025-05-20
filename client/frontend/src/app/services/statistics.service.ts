import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:7501/affaire';

  constructor(private http: HttpClient) {}

  getDegreJuridiqueStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/degre-juridique`);
  };
  getAvocatsCountByDegreAvecAffaires(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count-by-degre-avec-affaires`);
  }
}
