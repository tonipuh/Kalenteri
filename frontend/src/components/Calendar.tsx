import React from 'react';
import SunCalc from 'suncalc';

type Props = {
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
    name?: string;
    country?: string;
  };
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  events?: DayEvent[];
};

interface DayEvent {
  date: Date;
  hour: number;
  total: number;
}

export default function Calendar({ location, startMonth, startYear, endMonth, endYear, events }: Props) {
  console.log('Calendar received events:', events);

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDayTimes = (date: Date) => {
    const times = SunCalc.getTimes(date, location.latitude, location.longitude);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    const nextTimes = SunCalc.getTimes(nextDay, location.latitude, location.longitude);

    // Tarkistetaan onko auringonnousu/lasku olemassa
    const hasSunrise = !isNaN(times.sunrise.getTime());
    const hasSunset = !isNaN(times.sunset.getTime());

    // Käytetään auringon keskipäivää (solar noon)
    const solarNoonPosition = SunCalc.getPosition(
      times.solarNoon,
      location.latitude,
      location.longitude
    );

    // Tarkistetaan ylittääkö auringonlasku keskiyön vain korkeilla leveysasteilla
    const currentSunset = new Date(times.sunset);
    const isHighLatitude = Math.abs(location.latitude) > 60;
    const crossesMidnight = isHighLatitude && currentSunset.getHours() < 12;

    // Jos aurinko laskee seuraavan vuorokauden puolella korkeilla leveysasteilla,
    // käytetään seuraavan päivän laskuaikaa
    const actualSunset = crossesMidnight ? nextTimes.sunset : times.sunset;

    const isAscending = Math.abs(solarNoonPosition.altitude) < 0.334;

    if (!hasSunrise || !hasSunset) {
      return {
        sunrise: -1,
        sunset: -1,
        isPolarDay: solarNoonPosition.altitude > 0,
        isPolarNight: solarNoonPosition.altitude < 0,
        isAscending
      };
    }

    const localSunrise = new Date(times.sunrise).toLocaleString('en-US', {
      timeZone: location.timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });

    const localSunset = new Date(actualSunset).toLocaleString('en-US', {
      timeZone: location.timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });

    // Parsitaan tunnit ja minuutit
    const [sunriseHour, sunriseMinute] = localSunrise.split(':').map(Number);
    const [sunsetHour, sunsetMinute] = localSunset.split(':').map(Number);

    // Muunnetaan desimaalitunneiksi
    const sunriseDecimal = sunriseHour + (sunriseMinute / 60);
    const sunsetDecimal = crossesMidnight ? 24 : (sunsetHour + (sunsetMinute / 60));

    return {
      sunrise: sunriseDecimal,
      sunset: sunsetDecimal,
      isPolarDay: false,
      isPolarNight: false,
      isAscending
    };
  };

  const getHourColor = (hour: number, times: ReturnType<typeof getDayTimes>, isSunday: boolean) => {
    if (times.isPolarDay) {
      return isSunday ? 'bg-[#ffe6e6]' : 'bg-yellow-100';
    }
    if (times.isPolarNight) {
      return isSunday ? 'bg-[#f0f0f0]' : 'bg-gray-200';
    }

    if (hour >= times.sunrise && hour < times.sunset) {
      return isSunday ? 'bg-[#ffe6e6]' : 'bg-yellow-100';
    }
    return isSunday ? 'bg-[#f0f0f0]' : 'bg-gray-200';
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getWeekDay = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const getMonthRange = () => {
    const months = [];
    let currentDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(endYear, endMonth - 1);

    while (currentDate <= endDate) {
      months.push({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">
        {location.name}, {location.country}
      </h2>

      {getMonthRange().map(({ month, year }) => (
        <div key={`${month}-${year}`} className="mb-12">
          <h3 className="text-2xl font-bold mb-4">
            {MONTHS[month - 1]} {year}
          </h3>

          <div className="flex flex-col gap-1">
            {/* Tunnit ylhäällä */}
            <div className="flex items-center">
              <div className="w-32"></div>
              <div className="flex-1 grid grid-cols-24 gap-px">
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="text-center text-xs">
                    {i.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>

            {/* Päivät ja tunnit */}
            {Array.from({ length: getDaysInMonth(year, month) }, (_, dayIndex) => {
              const day = dayIndex + 1;
              const date = new Date(year, month - 1, day);
              const times = getDayTimes(date);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              // DST muutoksen tarkistus
              const previousDay = new Date(date);
              previousDay.setDate(date.getDate() - 1);

              const currentOffset = new Date(date.toLocaleString('en-US', { timeZone: location.timezone })).getTimezoneOffset();
              const previousOffset = new Date(previousDay.toLocaleString('en-US', { timeZone: location.timezone })).getTimezoneOffset();

              const dstChange = currentOffset !== previousOffset;

              return (
                <div key={dayIndex} className="flex items-center">
                  <div className={`w-32 font-medium ${isWeekend ? 'text-red-600' : ''}`}>
                    {day}.{month}
                  </div>
                  <div className="flex-1 grid grid-cols-24 gap-px">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const hourDecimal = hour;
                      let className = "calendar-cell ";

                      const event = events?.find(e => {
                        const eventDate = new Date(e.date);

                        // Debug tulostus
                        if (day === 3 && month === 12 && year === 2024 && hour === 13) {
                          console.log('Checking event:', {
                            event: e,
                            eventDate,
                            matching: {
                              day: eventDate.getDate() === day,
                              month: eventDate.getMonth() === month - 1,
                              year: eventDate.getFullYear() === year,
                              hour: e.hour === hour
                            }
                          });
                        }

                        return eventDate.getDate() === day &&
                               eventDate.getMonth() === month - 1 &&
                               eventDate.getFullYear() === year &&
                               e.hour === hour;
                      });

                      if (date.getDay() === 0) {
                        className += "sunday ";
                      }

                      if (hour >= times.sunrise && hour <= times.sunset) {
                        className += "daylight ";
                      } else {
                        className += "night ";
                      }

                      if (dstChange && hour === 2) {
                        className += "dst-change ";
                      }

                      return (
                        <div
                          key={hour}
                          className={className}
                          data-dst-type={dstChange ? (currentOffset < previousOffset ? "Kesäaika alkaa" : "Kesäaika päättyy") : ""}
                        >
                          {event && (
                            <span className="font-bold">{event.total}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}