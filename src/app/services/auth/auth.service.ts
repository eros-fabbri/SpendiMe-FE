import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserDetail} from '../../interfaces/user-detail';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  apiUrl = "http://localhost:8080"

  checkAuth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/check`, {
      withCredentials: true, // Invia i cookie insieme alla richiesta
    });
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/signin`,  // <-- il tuo endpoint Spring
      { email: email, password: password },
      { withCredentials: true }           // <-- fondamentale per usare i cookie
    );
  }

  signup(email: string, password: string, name: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/signup`,  // <-- il tuo endpoint Spring
      { email: email, password: password, name: name },
    );
  }

  getUserDetails(): Observable<UserDetail> {
    return this.http.get<UserDetail>(
      `${this.apiUrl}/account`,  // <-- il tuo endpoint Spring
      { withCredentials: true }           // <-- fondamentale per usare i cookie
    );
  }
}
