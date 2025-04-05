import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
  selector: 'app-login-form',
  imports: [
    MatCard,
    MatCardContent
  ],
  templateUrl: './login-form.component.html',
  standalone: true,
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

}
