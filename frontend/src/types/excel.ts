export interface DayEvent {
  date: Date;
  hour: number;
  total: number;
}

export interface ExcelRow {
  A: string;  // päivämäärä
  B: string;  // kellonaika
  C: string;  // määrä
}

export interface GroupedEvent {
  date: Date;
  hour: number;
  total: number;
}
