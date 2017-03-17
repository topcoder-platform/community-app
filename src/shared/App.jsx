import React from 'react';
import Icon from '../assets/icon.svg';
import Mod1 from './Mod1';
import Mod2 from './Mod2';
import './style.scss';

export default function App() {
  return (
    <div className="App">
      <h1>Hello World!132</h1>
      <p>Topcoder is the best!rferfr</p>
      <Icon width={150} height={150} stroke="green" />
      <Mod1 />
      <Mod2 />
    </div>
  );
}
