import express from 'express';
import * as SunCalc from 'suncalc';

const router = express.Router();

router.get('/', (req, res) => {
  const { lat, lon, date } = req.query;

  if (!lat || !lon || !date) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lon as string);
  const dateObj = new Date(date as string);

  try {
    // Tarkistetaan ensin onko yötön yö tai kaamos
    const positions = [];
    // Tarkistetaan 24 tunnin ajalta
    for (let i = 0; i < 24; i++) {
      const checkTime = new Date(dateObj);
      checkTime.setUTCHours(i, 0, 0, 0);
      const pos = SunCalc.getPosition(checkTime, latitude, longitude);
      positions.push(pos.altitude * (180 / Math.PI));
    }

    const maxAltitude = Math.max(...positions);
    const minAltitude = Math.min(...positions);

    console.log(`${dateObj.toISOString()}: Max altitude ${maxAltitude.toFixed(2)}°, Min altitude ${minAltitude.toFixed(2)}°`);

    // Tarkistetaan SunCalc:n nousu/lasku ajat
    const times = SunCalc.getTimes(dateObj, latitude, longitude);
    const hasSunrise = times.sunrise instanceof Date && !isNaN(times.sunrise.getTime());
    const hasSunset = times.sunset instanceof Date && !isNaN(times.sunset.getTime());

    // Jos aurinko on aina ylhäällä (yötön yö)
    // TAI jos nousu/lasku ajat ovat olemassa mutta aurinko ei käy horisontin alla
    if (minAltitude > -0.833 || (hasSunrise && hasSunset && minAltitude > -1)) {
      console.log('Sun never sets');
      return res.json({
        sunrise: null,
        sunset: null,
        alwaysUp: true,
        alwaysDown: false
      });
    }

    // Jos aurinko on aina alhaalla (kaamos)
    if (maxAltitude < -0.833) {
      console.log('Sun never rises');
      return res.json({
        sunrise: null,
        sunset: null,
        alwaysUp: false,
        alwaysDown: true
      });
    }

    // Normaalit nousu/lasku ajat
    if (hasSunrise && hasSunset) {
      console.log(`Normal day/night cycle: Sunrise ${times.sunrise.toISOString()}, Sunset ${times.sunset.toISOString()}`);
      return res.json({
        sunrise: times.sunrise.toISOString(),
        sunset: times.sunset.toISOString(),
        alwaysUp: false,
        alwaysDown: false
      });
    }

    // Jos tänne asti päästään, jotain meni pieleen
    console.log('Could not determine sun state');
    return res.json({
      sunrise: null,
      sunset: null,
      alwaysUp: false,
      alwaysDown: false
    });

  } catch (error) {
    console.error('Error calculating sun times:', error);
    res.status(200).json({
      sunrise: null,
      sunset: null,
      alwaysUp: false,
      alwaysDown: false
    });
  }
});

export default router;
