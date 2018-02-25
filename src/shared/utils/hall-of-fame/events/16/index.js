/**
 * Data and images for TCO Event
*/

/**
* These lines won't need to be changed unless an image needs a different file extension.
* If an event did not have the corresponding TRACK, the entire line can be commented out.
*/
import logo from './logo.png';
import banner from './banner.jpg';

import winnerAlgorithm from './winnerAlgorithm.png';
import winnerMarathon from './winnerMarathon.png';
import winnerDevelopment from './winnerDevelopment.png';
import winnerFirst2finish from './winnerFirst2finish.png';
import winnerUiDesign from './winnerUIDesign.png';
import winnerUiPrototype from './winnerUIPrototype.png';

/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreUrl: 'http://tco16.topcoder.com',
  location: 'Washington DC, US',
  date: '19 - 21 November 2016',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'handle',
    portrait: winnerAlgorithm,
    finalists: [
      'handle',
      'handle',
      'handle',
      'handle',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'handle',
    portrait: winnerMarathon,
    finalists: [
      'handle',
      'handle',
      'handle',
      'handle',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'handle',
    portrait: winnerDevelopment,
    finalists: [
      'handle',
      'handle',
      'handle',
      'handle',
    ],
  },

  // FIRST2FINISH Data Starts Here
  first2finish: {
    winner: 'handle',
    portrait: winnerFirst2finish,
    finalists: [
      'handle',
      'handle',
      'handle',
      'handle',
    ],
  },

  // UI DESIGN Data Starts Here
  uiDesign: {
    winner: 'handle',
    portrait: winnerUiDesign,
    finalists: [
      'handle',
      'handle',
      'handle',
      'handle',
    ],
  },

  // UI PROTOTYPE Data Starts Here
  uiPrototype: {
    winner: 'handle',
    portrait: winnerUiPrototype,
    finalists: [
      'handle',
      'handle',
      'handle',
      'handle',
    ],
  },
};
