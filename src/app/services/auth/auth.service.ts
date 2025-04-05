import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<void> {
    return this.http.post<void>(
      'http://localhost:8080/api/login',  // <-- il tuo endpoint Spring
      { username, password },
      { withCredentials: true }           // <-- fondamentale per usare i cookie
    );
  }
}
