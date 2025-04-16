import {Component, OnInit} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {UserDetail} from '../../interfaces/user-detail';

@Component({
  selector: 'app-navbar',
  imports: [
    NgClass,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  userDetails?: UserDetail

  constructor(protected router: Router) {
  }

  ngOnInit(): void {
    const storedUser = sessionStorage.getItem('user');

    if (storedUser) {
      this.userDetails = JSON.parse(storedUser);
    }
  }

}
