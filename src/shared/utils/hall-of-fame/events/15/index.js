/**
 * Data and images for TCO Event
*/

/**
* These lines won't need to be changed unless an image needs a different file extension.
* If an event did not have the corresponding TRACK, the entire line can be commented out.
*/
import logo from './logo.png';
import banner from './banner.jpg';

import winnerAlgorithm from './winnerAlgorithm.jpg';
import winnerMarathon from './winnerMarathon.jpeg';
import winnerDevelopment from './winnerDevelopment.jpg';
import winnerUiDesign from './winnerUiDesign.jpg';
import winnerUiPrototype from './winnerUiPrototype.jpeg';

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
  location: 'Yogyakarta, Indonesia & Indianapolis, Indiana, USA',
  date: 'Sept 21 - Sept 22, 2015 Nov 8 - Nov 10 2015',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'Petr',
    portrait: winnerAlgorithm,
    finalists: [
      'kuniavki',
      'Kankuro',
      'bmerry',
      'ecnerwal',
      'Egor',
      'Endagorion',
      'qwerty787788',
      'scott_wu',
      'subscriber',
      'tourist',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'ACRush',
    portrait: winnerMarathon,
    finalists: [
      'nhzp339',
      'Psyho',
      'CatalinT',
      'colun',
      'eldidou',
      'fhlasek',
      'komaki',
      'Mojito1',
      'mugurelionut',
      'takapt',
      'wleite',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'Sky_',
    portrait: winnerDevelopment,
    finalists: [
      'albertwang',
      'ananthhh',
      'bannie2492',
      'flytoj2ee',
      'kinfkong',
      'mohamede1945',
      'MonicaMuranyi',
      'N1k1tung',
      'seriyvolk83',
      'ultronzero',
      'yedtoss',
    ],
  },

  // UI DESIGN Data Starts Here
  uiDesign: {
    winner: 'abedavera',
    portrait: winnerUiDesign,
    finalists: [
      'iamtong',
      'kharm',
      'aditm17',
      'chekspir',
      'DaraK',
      'iaminfinite',
      'idblack',
      'jeniroxy',
      'ravijune',
      'tototpc',
      'yoki',
    ],
  },

  // UI PROTOTYPE Data Starts Here
  uiPrototype: {
    winner: 'dileepa',
    portrait: winnerUiPrototype,
    finalists: [
      'albertwang',
      'amethystlei',
      'fivestarwy',
      'hi4sandy',
      'moulyg',
    ],
  },

  // Trip Winners Data Starts Here
  tripWinners: [
    {
      role: 'COPILOT',
      winners: [
        'FireIce',
        'Ghostar',
        'iSpartan',
        'Wendell',
      ],
    },
    {
      role: 'INFORMATION ARCHITECTURE',
      winners: [
        'DaraK',
        'eng01',
        'f0rc0d3r',
        'lunana',
        'picachui',
        'rainforest',
        'selvia_ettine',
        'teevics',
      ],
    },
  ],
};
