export interface CalendarDay {
  date: Date;
  weekday: string;
  isWeekend: boolean;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  hour: number;
  isNightTime: boolean;
}

export interface SunlightTimes {
  dawn: string;
  sunrise: string;
  sunset: string;
  dusk: string;
}