import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<void> {
    return this.http.post<void>(
      'http://localhost:8080/auth/signin',  // <-- il tuo endpoint Spring
      { email: email, password: password },
      { withCredentials: true }           // <-- fondamentale per usare i cookie
    );
  }
}
