import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'SpendiMe-FE';

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getUserDetails().subscribe((userDetails) => sessionStorage.setItem('user', JSON.stringify(userDetails)))
  }
}
