import { Component } from '@angular/core';
import {SpeseMensiliChartComponent} from '../charts/spese-mensili-chart/spese-mensili-chart.component';

@Component({
  selector: 'app-spese',
  imports: [
    SpeseMensiliChartComponent
  ],
  templateUrl: './spese.component.html',
  styleUrl: './spese.component.css'
})
export class SpeseComponent {

}
