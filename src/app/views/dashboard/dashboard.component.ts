import { Component } from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(protected router: Router) {
  }

}
