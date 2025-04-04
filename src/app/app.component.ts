import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginViewComponent} from './views/login-view/login-view.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SpendiMe-FE';
}
