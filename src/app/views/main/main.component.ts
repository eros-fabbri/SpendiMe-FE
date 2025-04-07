import { Component } from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-main',
  imports: [
    NgOptimizedImage,
    NgClass,
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(protected router: Router) {
  }

}
