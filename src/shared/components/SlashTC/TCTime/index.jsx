/**
 * Topcoder Time Component
 */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import darkTheme from './dark.scss';

const THEMES = {
  dark: darkTheme,
};

function TopcoderTime() {
  const theme = THEMES.dark; // for v1 only dark theme
  const FORMAT = 'MMM Do, hh:mm A';
  const TIMEZONE = 'America/New_York';
  const [tcTime, setTCTime] = useState(`${moment.tz(new Date(), TIMEZONE).format(FORMAT)} EST`);
  useEffect(() => {
    const interval = setInterval(() => {
      setTCTime(`${moment.tz(new Date(), TIMEZONE).format(FORMAT)} EST`);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={theme.container}>
      <span className={theme.title}>Topcoder Time</span>
      <span className={theme.time}>{tcTime}</span>
    </div>
  );
}

export default TopcoderTime;
