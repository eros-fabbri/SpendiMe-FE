import { Routes } from '@angular/router';
import {LoginViewComponent} from './views/login-view/login-view.component';
import {authGuard} from './guards/auth.guard';
import {AppComponent} from './app.component';
import {SignupViewComponent} from './views/signup-view/signup-view.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard'},
  { path: 'login', component: LoginViewComponent},
  { path: 'signup', component: SignupViewComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },


];
