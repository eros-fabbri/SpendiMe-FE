import { Component } from '@angular/core';
import {LoginFormComponent} from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-login-view',
  imports: [
    LoginFormComponent
  ],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})
export class LoginViewComponent {

}
