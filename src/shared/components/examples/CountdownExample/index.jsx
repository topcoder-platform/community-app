import React from 'react';
import Countdown from 'components/Countdown';


import './style.scss';

export default function CountdownExample() {
  const end = new Date();
  const numberOfDaysToAdd = 6;
  end.setDate(end.getDate() + numberOfDaysToAdd);

  return (
    <div styleName="container">
      <h1>Countdown</h1>
      <Countdown end={end} />
    </div>
  );
}
