import { Routes } from '@angular/router';
import {LoginViewComponent} from './views/login-view/login-view.component';
import {authGuard} from './guards/auth.guard';
import {AppComponent} from './app.component';
import {SignupViewComponent} from './views/signup-view/signup-view.component';

export const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginViewComponent},
  { path: 'signup', component: SignupViewComponent},
];
