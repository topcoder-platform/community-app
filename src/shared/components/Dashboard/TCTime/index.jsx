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
  let FORMAT = 'MMM Do, HH:mm UTC';
  const TIMEZONE = 'America/New_York';
  const now = moment.tz(new Date(), TIMEZONE);
  FORMAT += now.utcOffset() / 60;
  const [tcTime, setTCTime] = useState(`${now.format(FORMAT)}`);
  useEffect(() => {
    const interval = setInterval(() => {
      setTCTime(moment.tz(new Date(), TIMEZONE).format(FORMAT));
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
