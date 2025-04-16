import {Routes} from '@angular/router';
import {LoginViewComponent} from './views/login-view/login-view.component';
import {authGuard} from './guards/auth.guard';
import {AppComponent} from './app.component';
import {SignupViewComponent} from './views/signup-view/signup-view.component';
import {MainComponent} from './views/main/main.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {SpeseComponent} from './components/spese/spese.component';

// export const routes: Routes = [
//   { path: '', component: MainComponent, canActivate:[authGuard]},
//   {path: 'dashboard', component: DashboardComponent},
//   { path: 'login', component: LoginViewComponent},
//   { path: 'signup', component: SignupViewComponent},
//
//
// ];

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'spese', component: SpeseComponent},
    ]
  },
  {path: 'login', component: LoginViewComponent},
];
