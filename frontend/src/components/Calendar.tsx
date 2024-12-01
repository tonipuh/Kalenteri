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
};

export default function Calendar({ location, startMonth, startYear, endMonth, endYear }: Props) {
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

    // Tarkistetaan ylittääkö auringonlasku keskiyön
    const sunsetHour = new Date(times.sunset).getHours();
    const crossesMidnight = sunsetHour < 12;

    // Jos aurinko laskee seuraavan vuorokauden puolella,
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
      hour12: false
    });

    const localSunset = new Date(actualSunset).toLocaleString('en-US', {
      timeZone: location.timezone,
      hour: 'numeric',
      hour12: false
    });

    // Jos aurinko laskee seuraavana päivänä, sunset on 24
    const sunsetHourInt = crossesMidnight ? 24 : parseInt(localSunset);

    return {
      sunrise: parseInt(localSunrise),
      sunset: sunsetHourInt,
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
              const weekDay = getWeekDay(year, month, day);
              const isSunday = weekDay === 'Sun';
              const times = getDayTimes(new Date(year, month - 1, day));

              return (
                <div key={dayIndex} className="flex items-center">
                  <div className={`w-32 font-medium ${isSunday ? 'text-red-600' : ''}`}>
                    {day} {weekDay}
                  </div>
                  <div className="flex-1 grid grid-cols-24 gap-px">
                    {Array.from({ length: 24 }, (_, hour) => (
                      <div
                        key={hour}
                        className={`h-8 ${getHourColor(hour, times, isSunday)}`}
                        title={`${day} ${weekDay}, ${hour}:00`}
                      />
                    ))}
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