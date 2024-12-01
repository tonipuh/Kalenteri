declare module 'suncalc' {
  interface SunTimes {
    sunrise: Date;
    sunset: Date;
    solarNoon: Date;
    nadir: Date;
    dawn: Date;
    dusk: Date;
    nauticalDawn: Date;
    nauticalDusk: Date;
    nightEnd: Date;
    night: Date;
    goldenHourEnd: Date;
    goldenHour: Date;
  }

  function getTimes(date: Date, latitude: number, longitude: number): SunTimes;
  function getPosition(date: Date, latitude: number, longitude: number): { altitude: number; azimuth: number };

  export = {
    getTimes,
    getPosition
  };
}
