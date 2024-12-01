export interface City {
    name: string;
    country: string;
    lat: number;
    lon: number;
    population?: number;
}

export interface SunlightResult {
    dawn: string;
    sunrise: string;
    sunset: string;
    dusk: string;
    type: 'nordic_summer' | 'nordic_winter' | 'normal' | 'fallback';
}
