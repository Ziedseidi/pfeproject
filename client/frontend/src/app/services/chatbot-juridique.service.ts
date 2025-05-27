import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ReponseChatbot {
  réponse: string;
  question?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotJuridiqueService {
  private apiUrl = 'http://localhost:5000/question'; // adapte le port si besoin

  constructor(private http: HttpClient) {}

  getAnswer(question: string): Observable<ReponseChatbot> {
    const url = `${this.apiUrl}?q=${encodeURIComponent(question)}`;
    return this.http.get<ReponseChatbot>(url);
  }
}
