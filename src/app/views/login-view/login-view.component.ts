import { Component } from '@angular/core';
import {LoginFormComponent} from '../../components/login-form/login-form.component';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-view',
  imports: [
    FormsModule
  ],
  templateUrl: './login-view.component.html',
  standalone: true,
  styleUrl: './login-view.component.css'
})
export class LoginViewComponent {
  email = '';
  password = '';


  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['dashboard']),
      error: err => console.error('Errore login:', err)
    });
  }

}

