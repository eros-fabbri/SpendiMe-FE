import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, addDays, subDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { Observable, of } from 'rxjs';
import {Chart} from 'chart.js';
import {Spesa} from '../../../interfaces/spesa';
import {SpesaService} from '../../../services/spesa.service';

@Component({
  selector: 'app-spese-mensili-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #speseMensiliCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
      margin: 0 auto;
      padding: 16px;
    }
  `]
})
export class SpeseMensiliChartComponent implements OnInit, AfterViewInit {
  @ViewChild('speseMensiliCanvas') private speseMensiliCanvas!: ElementRef;
  private chart: Chart | undefined;
  private spese: Spesa[] = [];
  private useMockData = true; // Imposta su false per utilizzare dati reali dal servizio

  constructor(private spesaService: SpesaService) {}

  ngOnInit(): void {
    this.loadSpese();
  }

  ngAfterViewInit(): void {
    // Se il canvas è pronto ma i dati non sono ancora caricati
    if (this.speseMensiliCanvas && this.spese.length === 0) {
      this.loadSpese();
    }
  }

  private loadSpese(): void {
    const spesaObservable: Observable<Spesa[]> = this.useMockData ?
      this.getMockSpese() :
      this.spesaService.getSpese();

    spesaObservable.subscribe(spese => {
      this.spese = spese;
      this.initializeChart();
    });
  }

  private getMockSpese(): Observable<Spesa[]> {
    const mockSpese: Spesa[] = [];
    const oggi = new Date();
    const inizioMese = startOfMonth(oggi);

    // Generiamo spese casuali per diversi giorni del mese corrente
    for (let i = 0; i < 40; i++) {
      // Distribuire le spese nel mese corrente
      const giornoRandom = Math.floor(Math.random() * 28);
      const dataSpesa = addDays(inizioMese, giornoRandom);

      // Se la data è nel futuro rispetto a oggi, la spostiamo indietro
      const dataFinale = dataSpesa > oggi ?
        subDays(oggi, Math.floor(Math.random() * 10)) :
        dataSpesa;

      mockSpese.push({
        id: i + 1,
        descrizione: `Spesa mock ${i + 1}`,
        importo: Math.floor(Math.random() * 150) + 5, // Importo tra 5 e 155 euro
        data: format(dataFinale, 'yyyy-MM-dd'),
        categoria: this.getCategoriaRandom(),
        metodoPagamento: this.getMetodoPagamentoRandom()
      });
    }

    return of(mockSpese);
  }

  private getCategoriaRandom(): string {
    const categorie = ['Alimentari', 'Trasporti', 'Bollette', 'Svago', 'Shopping', 'Casa', 'Salute'];
    return categorie[Math.floor(Math.random() * categorie.length)];
  }

  private getMetodoPagamentoRandom(): string {
    const metodi = ['Carta di credito', 'Contanti', 'Bonifico', 'PayPal', 'Satispay'];
    return metodi[Math.floor(Math.random() * metodi.length)];
  }

  private initializeChart(): void {
    if (!this.speseMensiliCanvas) return;

    const oggi = new Date();
    const inizioMese = startOfMonth(oggi);
    const fineMese = endOfMonth(oggi);

    // Genera un array con tutti i giorni del mese corrente
    const giorniMese = eachDayOfInterval({ start: inizioMese, end: oggi });

    // Calcola le spese totali per ogni giorno del mese
    const datiSpese = giorniMese.map(giorno => {
      const speseDiQuestoGiorno = this.spese.filter(spesa => {
        const dataSpesa = parseISO(spesa.data);
        return format(dataSpesa, 'yyyy-MM-dd') === format(giorno, 'yyyy-MM-dd');
      });

      const totaleGiornaliero = speseDiQuestoGiorno.reduce((acc, spesa) =>
        acc + spesa.importo, 0);

      return {
        giorno,
        totale: totaleGiornaliero
      };
    });

    const ctx = this.speseMensiliCanvas.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: datiSpese.map(d => format(d.giorno, 'd', { locale: it })),
        datasets: [{
          label: 'Spese giornaliere',
          data: datiSpese.map(d => d.totale),
          backgroundColor: (context) => {
            const value = context.raw as number;
            // Gradiente di colori basato sull'importo
            if (value > 100) return 'rgba(255, 99, 132, 0.7)'; // Rosso per spese alte
            if (value > 50) return 'rgba(255, 159, 64, 0.7)';  // Arancione per spese medie
            return 'rgba(75, 192, 192, 0.7)';                  // Verde-acqua per spese basse
          },
          borderColor: (context) => {
            const value = context.raw as number;
            if (value > 100) return 'rgba(255, 99, 132, 1)';
            if (value > 50) return 'rgba(255, 159, 64, 1)';
            return 'rgba(75, 192, 192, 1)';
          },
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: (items) => {
                if (!items.length) return '';
                const idx = items[0].dataIndex;
                return format(datiSpese[idx].giorno, 'EEEE d MMMM', { locale: it });
              },
              label: (context) => {
                return `€ ${context.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 10
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: (value) => `€ ${value}`
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }
}
