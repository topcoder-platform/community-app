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
import winnerMarathon from './winnerMarathon.png';
import winnerDevelopment from './winnerDevelopment.jpg';
import winnerFirst2finish from './winnerFirst2finish.png';
import winnerUiDesign from './winnerUIDesign.jpg';
import winnerUiPrototype from './winnerUIPrototype.jpg';

/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreURL: 'http://tco16.topcoder.com',
  browseGalleryURL: 'https://tco16.topcoder.com/photos/',
  location: 'Washington DC, US',
  date: '19 - 21 November 2016',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'rng_58',
    portrait: winnerAlgorithm,
    finalists: [
      'bmerry',
      'eatmore',
      'Enot',
      'ikatanic',
      'K.A.D.R',
      'Kankuro',
      'krijgertje',
      'Petr',
      'scott_wu',
      'tourist',
      'Um_nik',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'Psyho',
    portrait: winnerMarathon,
    finalists: [
      'CatalinT',
      'eldidou',
      'imazato',
      'marek.cygan',
      'nhzp339',
      'nika',
      'wleite',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'Sky_',
    portrait: winnerDevelopment,
    finalists: [
      'cjalmeida',
      'kinfkong',
      'MonicaMuranyi',
      'NightWolf',
      'seriyvolk83',
      'spanhawk',
      'vvvpig',
    ],
  },

  // FIRST2FINISH Data Starts Here
  first2finish: {
    winner: 'vvvpig',
    portrait: winnerFirst2finish,
    finalists: [
      'ananthhh',
      'callmekatootie',
      'gondzo',
      'lbotsch',
      'morehappiness',
      'seriyvolk83',
      'smtryingcode',
    ],
  },

  // UI DESIGN Data Starts Here
  uiDesign: {
    winner: 'abedavera',
    portrait: winnerUiDesign,
    finalists: [
      'ArteVisual',
      'cendhika',
      'iamtong',
      'kharm',
      'nicokontes',
      'ravijune',
      'Tewibowo',
      'yiming',
      'yoki',
    ],
  },

  // UI PROTOTYPE Data Starts Here
  uiPrototype: {
    winner: 'moulyg',
    portrait: winnerUiPrototype,
    finalists: [
      'dileepa',
      'hi4sandy',
      'leo.ananth',
      'nghi85',
      'nomo_kazza',
      'soso0574',
      'thomaskranitsas',
    ],
  },

  // Trip Winners Data Starts Here
  tripWinners: [
    {
      role: 'COPILOT',
      winners: [
        'elkhawajah',
        'FireIce',
        'Ghostar',
        'Wendell',
      ],
    },
    {
      role: 'WIREFRAME',
      winners: [
        'DaraK',
        'f0rc0d3r',
        'picachui',
        'selvia_ettine',
      ],
    },
    {
      role: 'TRIP WINNERS',
      winners: [
        'akinwale',
        'birdofpreyru',
      ],
    },
    {
      role: 'IOS',
      winners: [
        'N1k1tung',
      ],
    },
    {
      role: 'OTHERS',
      winners: [
        'cgy4ever',
        'chekspir',
        'jaco.cronje',
        'mahestro',
        'quesks',
        'talesforce',
      ],
    },
  ],
};
