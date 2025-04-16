// src/app/services/spesa.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { format, startOfMonth, endOfMonth, addDays, subDays } from 'date-fns';
import {CategoriaSpesa, MetodoPagamento, Spesa, SpesaCreate} from '../interfaces/spesa';

@Injectable({
  providedIn: 'root'
})
export class SpesaService {
  private apiUrl = `test.it/spese`;

  // Flag per usare dati mock senza API
  private useMockData = true;

  // Cache dei dati mock
  private mockSpeseCache: Spesa[] | null = null;

  constructor(private http: HttpClient) { }

  /**
   * Recupera l'elenco delle spese con opzioni di filtro
   */
  getSpese(
    startDate?: Date,
    endDate?: Date,
    categoria?: string
  ): Observable<Spesa[]> {
    if (this.useMockData) {
      return this.getMockSpese(startDate, endDate, categoria);
    }

    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', format(startDate, 'yyyy-MM-dd'));
    }

    if (endDate) {
      params = params.set('endDate', format(endDate, 'yyyy-MM-dd'));
    }

    if (categoria) {
      params = params.set('categoria', categoria);
    }

    return this.http.get<Spesa[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Errore nel recupero delle spese', error);
        return of([]);
      })
    );
  }

  /**
   * Recupera le spese del mese corrente
   */
  getSpeseMeseCorrente(): Observable<Spesa[]> {
    const oggi = new Date();
    const inizioMese = startOfMonth(oggi);
    const fineMese = endOfMonth(oggi);

    return this.getSpese(inizioMese, fineMese);
  }

  /**
   * Recupera una spesa specifica per ID
   */
  getSpesaById(id: number): Observable<Spesa | null> {
    if (this.useMockData) {
      // Se stiamo usando dati mock, recuperiamo la spesa dalla cache mock
      return this.getMockSpese().pipe(
        map(spese => spese.find(spesa => spesa.id === id) || null)
      );
    }

    return this.http.get<Spesa>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Errore nel recupero della spesa con ID ${id}`, error);
        return of(null);
      })
    );
  }

  /**
   * Crea una nuova spesa
   */
  createSpesa(spesa: SpesaCreate): Observable<Spesa> {
    if (this.useMockData) {
      return this.createMockSpesa(spesa);
    }

    return this.http.post<Spesa>(this.apiUrl, spesa).pipe(
      catchError(error => {
        console.error('Errore nella creazione della spesa', error);
        throw error;
      })
    );
  }

  /**
   * Aggiorna una spesa esistente
   */
  updateSpesa(id: number, spesa: SpesaCreate): Observable<Spesa> {
    if (this.useMockData) {
      return this.updateMockSpesa(id, spesa);
    }

    return this.http.put<Spesa>(`${this.apiUrl}/${id}`, spesa).pipe(
      catchError(error => {
        console.error(`Errore nell'aggiornamento della spesa con ID ${id}`, error);
        throw error;
      })
    );
  }

  /**
   * Elimina una spesa esistente
   */
  deleteSpesa(id: number): Observable<boolean> {
    if (this.useMockData) {
      return this.deleteMockSpesa(id);
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Errore nell'eliminazione della spesa con ID ${id}`, error);
        return of(false);
      })
    );
  }

  /**
   * Calcola il totale delle spese in un periodo
   */
  getTotaleSpese(startDate?: Date, endDate?: Date, categoria?: string): Observable<number> {
    return this.getSpese(startDate, endDate, categoria).pipe(
      map(spese => spese.reduce((total, spesa) => total + spesa.importo, 0))
    );
  }

  /**
   * Genera dati mock per simulare le spese
   */
  private getMockSpese(startDate?: Date, endDate?: Date, categoria?: string): Observable<Spesa[]> {
    // Se non abbiamo ancora generato i dati mock, li creiamo
    if (!this.mockSpeseCache) {
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
          descrizione: `Spesa ${i + 1} - ${this.getDescrizioneRandom()}`,
          importo: Math.floor(Math.random() * 150) + 5, // Importo tra 5 e 155 euro
          data: format(dataFinale, 'yyyy-MM-dd'),
          categoria: this.getCategoriaRandom(),
          metodoPagamento: this.getMetodoPagamentoRandom(),
          note: Math.random() > 0.7 ? 'Nota di esempio' : undefined
        });
      }

      this.mockSpeseCache = mockSpese;
    }

    // Filtra i dati in base ai parametri forniti
    let speseFiltrate = [...this.mockSpeseCache];

    if (startDate) {
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      speseFiltrate = speseFiltrate.filter(spesa => spesa.data >= startDateStr);
    }

    if (endDate) {
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      speseFiltrate = speseFiltrate.filter(spesa => spesa.data <= endDateStr);
    }

    if (categoria) {
      speseFiltrate = speseFiltrate.filter(spesa => spesa.categoria === categoria);
    }

    return of(speseFiltrate.sort((a, b) => a.data.localeCompare(b.data)));
  }

  /**
   * Crea una spesa nei dati mock
   */
  private createMockSpesa(spesa: SpesaCreate): Observable<Spesa> {
    // Assicuriamoci che la cache sia inizializzata
    if (!this.mockSpeseCache) {
      this.getMockSpese().subscribe();
    }

    const newId = this.mockSpeseCache ?
      Math.max(...this.mockSpeseCache.map(s => s.id)) + 1 :
      1;

    const newSpesa: Spesa = {
      ...spesa,
      id: newId
    };

    if (this.mockSpeseCache) {
      this.mockSpeseCache.push(newSpesa);
    }

    return of(newSpesa);
  }

  /**
   * Aggiorna una spesa nei dati mock
   */
  private updateMockSpesa(id: number, spesa: SpesaCreate): Observable<Spesa> {
    if (!this.mockSpeseCache) {
      this.getMockSpese().subscribe();
    }

    const index = this.mockSpeseCache?.findIndex(s => s.id === id) ?? -1;

    if (index === -1) {
      return new Observable(observer => {
        observer.error(new Error(`Spesa con ID ${id} non trovata`));
      });
    }

    const updatedSpesa: Spesa = {
      ...spesa,
      id
    };

    if (this.mockSpeseCache) {
      this.mockSpeseCache[index] = updatedSpesa;
    }

    return of(updatedSpesa);
  }

  /**
   * Elimina una spesa nei dati mock
   */
  private deleteMockSpesa(id: number): Observable<boolean> {
    if (!this.mockSpeseCache) {
      this.getMockSpese().subscribe();
    }

    const index = this.mockSpeseCache?.findIndex(s => s.id === id) ?? -1;

    if (index === -1) {
      return of(false);
    }

    if (this.mockSpeseCache) {
      this.mockSpeseCache.splice(index, 1);
    }

    return of(true);
  }

  /**
   * Genera una descrizione casuale per i dati mock
   */
  private getDescrizioneRandom(): string {
    const descrizioni = [
      'Spesa al supermercato',
      'Rifornimento carburante',
      'Pranzo fuori',
      'Biglietto cinema',
      'Abbonamento streaming',
      'Farmacia',
      'Bolletta luce',
      'Shopping online',
      'Caffè',
      'Ristorante',
      'Regalo compleanno',
      'Taglio capelli',
      'Riparazione auto',
      'Abbigliamento',
      'Libri'
    ];
    return descrizioni[Math.floor(Math.random() * descrizioni.length)];
  }

  /**
   * Genera una categoria casuale per i dati mock
   */
  private getCategoriaRandom(): string {
    const categorie = Object.values({...CategoriaSpesa});
    return categorie[Math.floor(Math.random() * categorie.length)];
  }

  /**
   * Genera un metodo di pagamento casuale per i dati mock
   */
  private getMetodoPagamentoRandom(): string {
    const metodi = Object.values({...MetodoPagamento});
    return metodi[Math.floor(Math.random() * metodi.length)];
  }
}
