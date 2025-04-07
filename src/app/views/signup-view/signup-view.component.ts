import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup-view',
    imports: [
        FormsModule
    ],
  templateUrl: './signup-view.component.html',
  styleUrl: './signup-view.component.css'
})
export class SignupViewComponent {
  name = ''
  email = '';
  password = '';
  repeatPassword = '';


  constructor(private auth: AuthService) {}

  signup() {
    this.auth.signup(this.email, this.password, this.name).subscribe({
      next: () => console.log('Login effettuato!'),
      error: err => console.error('Errore login:', err)
    });
  }
}
