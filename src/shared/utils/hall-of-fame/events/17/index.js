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
  learnMoreURL: 'http://tco17.topcoder.com',
  browseGalleryURL: 'https://tco17.topcoder.com/onsite-photos/',
  location: 'Buffalo, NY, US',
  date: 'Oct 21 - Oct 24, 2017',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'xudyh',
    portrait: winnerAlgorithm,
    finalists: [
      'rng_58',
      'scott_wu',
      '-XraY-',
      'bcip',
      'ikatanic',
      'kuniavski',
      'Nika',
      'qwerty787788',
      'RRx',
      'tourist',
      'Um_nik',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'Psyho',
    portrait: winnerMarathon,
    finalists: [
      'chokudai',
      'wleite',
      'ainu7',
      'blackmath',
      'CatalinT',
      'marek.cygan',
      'Milanin',
      'mugurelionut',
      'nhzp339',
      'PaulJefferys',
      'tomerun',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'birdofpreyru',
    portrait: winnerDevelopment,
    finalists: [
      'Sky_',
      'seriyvolk83',
      'billsedison',
      'chok68',
      'fivestarwy',
      'jiangliwu',
      'ketzjs09',
      'NightWolf',
      'ouyangki',
      'spanhawk',
      'veshu',
    ],
  },

  // FIRST2FINISH Data Starts Here
  first2finish: {
    winner: 'akinwale',
    portrait: winnerFirst2finish,
    finalists: [
      'gondzo',
      'Thomaskranitsas',
      'daft300punk',
      'happyesthete',
      'ian-sadovy',
      'mishacucicea',
      'mohhasbias',
      'ouyangki',
      'vasilica.olariu',
      'veshu',
    ],
  },

  // UI DESIGN Data Starts Here
  uiDesign: {
    winner: 'kharm',
    portrait: winnerUiDesign,
    finalists: [
      'Ravijune',
      'iamtong',
      'abedavera',
      'ariefk',
      'chekspir',
      'djackmania',
      'eriantoongko',
      'khanhlinh',
      'Tewibowo',
      'universo',
      'Yiming',
      'yoki',
      'zazulyaziz',
    ],
  },

  // UI PROTOTYPE Data Starts Here
  uiPrototype: {
    winner: 'moulyg',
    portrait: winnerUiPrototype,
    finalists: [
      'thomaskranitsas',
      'vasilica.olariu',
      'Cristian77',
      'daga_sumit',
      'happyesthete',
      'hi4sandy',
      'iversonLV',
      'leo.ananth',
      'nghi85',
      'smtryingcode',
    ],
  },

  // Trip Winners Data Starts Here
  tripWinners: [
    {
      role: 'COPILOT',
      winners: [
        'fajar.mln',
        'mahestro',
        'talesforce',
        'Wendell',
      ],
    },
    {
      role: 'WIREFRAME',
      winners: [
        'diferentway',
        'f0rc0d3r',
        'pandorabox',
        'picachui',
      ],
    },
    {
      role: 'OTHERS',
      winners: [
        'cendhika',
        'cyg4ever',
        'DaraK',
        'gorbunov',
        'nickolas',
      ],
    },
    {
      role: 'TRIP WINNERS',
      winners: [
        'nofto',
        'paolog',
        'KShiv',
      ],
    },
  ],
};
