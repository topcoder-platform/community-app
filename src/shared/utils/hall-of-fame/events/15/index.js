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
  learnMoreURL: 'http://tco15.topcoder.com',
  browseGalleryURL: 'https://tco15.topcoder.com/photos/',
  location: 'Indianapolis, Indiana, USA',
  date: '8 - 10 November 2015',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'handle',
    portrait: winnerAlgorithm,
    finalists: [
      'handle1',
      'handle2',
      'handle3',
      'handle4',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'handle',
    portrait: winnerMarathon,
    finalists: [
      'handle1',
      'handle2',
      'handle3',
      'handle4',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'handle',
    portrait: winnerDevelopment,
    finalists: [
      'handle1',
      'handle2',
      'handle3',
      'handle4',
    ],
  },

  // FIRST2FINISH Data Starts Here
  first2finish: {
    winner: 'handle',
    portrait: winnerFirst2finish,
    finalists: [
      'handle1',
      'handle2',
      'handle3',
      'handle4',
    ],
  },

  // UI DESIGN Data Starts Here
  uiDesign: {
    winner: 'handle',
    portrait: winnerUiDesign,
    finalists: [
      'handle1',
      'handle2',
      'handle3',
      'handle4',
    ],
  },

  // UI PROTOTYPE Data Starts Here
  uiPrototype: {
    winner: 'handle',
    portrait: winnerUiPrototype,
    finalists: [
      'handle1',
      'handle2',
      'handle3',
      'handle4',
    ],
  },

  // Trip Winners Data Starts Here
  tripWinners: [
    {
      role: 'COPILOT',
      winners: [
        'handle1',
        'handle2',
        'handle3',
      ],
    },
    {
      role: 'WIREFRAME',
      winners: [
        'handle1',
        'handle2',
        'handle3',
      ],
    },
    {
      role: 'OTHERS',
      winners: [
        'handle1',
        'handle2',
        'handle3',
      ],
    },
  ],
};
