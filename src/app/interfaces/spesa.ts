// src/app/models/spesa.model.ts

export interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data: string; // formato: 'yyyy-MM-dd'
  categoria: string;
  metodoPagamento: string;
  note?: string;
}

export interface SpesaCreate {
  descrizione: string;
  importo: number;
  data: string;
  categoria: string;
  metodoPagamento: string;
  note?: string;
}

// Enum per le categorie di spesa predefinite
export enum CategoriaSpesa {
  ALIMENTARI = 'Alimentari',
  TRASPORTI = 'Trasporti',
  BOLLETTE = 'Bollette',
  SVAGO = 'Svago',
  SHOPPING = 'Shopping',
  CASA = 'Casa',
  SALUTE = 'Salute',
  ALTRO = 'Altro'
}

// Enum per i metodi di pagamento predefiniti
export enum MetodoPagamento {
  CARTA_CREDITO = 'Carta di credito',
  CARTA_DEBITO = 'Carta di debito',
  CONTANTI = 'Contanti',
  BONIFICO = 'Bonifico',
  PAYPAL = 'PayPal',
  SATISPAY = 'Satispay',
  ALTRO = 'Altro'
}
