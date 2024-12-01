export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timezone: string;
}

export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
