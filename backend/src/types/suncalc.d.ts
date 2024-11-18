declare module 'suncalc' {
  interface SunTimes {
    sunrise: Date;
    sunset: Date;
    dawn: Date;
    dusk: Date;
    solarNoon: Date;
    night: Date;
    nightEnd: Date;
    goldenHour: Date;
    goldenHourEnd: Date;
  }

  function getTimes(date: Date, latitude: number, longitude: number): SunTimes;
  function getPosition(date: Date, latitude: number, longitude: number): { altitude: number; azimuth: number; };
  function getMoonPosition(date: Date, latitude: number, longitude: number): { altitude: number; azimuth: number; distance: number; parallacticAngle: number; };
  function getMoonIllumination(date: Date): { fraction: number; phase: number; angle: number; };
  function getMoonTimes(date: Date, latitude: number, longitude: number): { rise: Date; set: Date; alwaysUp?: boolean; alwaysDown?: boolean; };
}
