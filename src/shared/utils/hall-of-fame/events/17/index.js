/**
 * Data and images for TCO Event
*/

/**
* These lines won't need to be changed unless an image needs a different file extension.
* If an event did not have the corresponding TRACK, the entire line can be commented out.
* An example is provided.
*/
import logo from './logo.png';
import banner from './banner.png';

import winnerAlgorithm from './winnerAlgorithm.png';
import winnerMarathon from './winnerMarathon.png';
import winnerDevelopment from './winnerDevelopment.png';
import winnerFirst2finish from './winnerFirst2finish.png';
import winnerUiDesign from './winnerUIDesign.png';
import winnerUiPrototype from './winnerUIPrototype.png';
// import trackNotInEvent from './example.png';

/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreUrl: 'http://tco17.topcoder.com',
  location: 'Buffalo, NY, US',
  date: '21 - 24 October 2017',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'xudyh',
    portrait: winnerAlgorithm,
    finalists: [
      'scott_wu',
      'rng_58',
      'bcip',
      'ikatanic',
      'tourist',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'Psyho',
    portrait: winnerMarathon,
    finalists: [
      'ainu7',
      'blackmath',
      'CatalinT',
      'chukudai',
      'marek_cygnan',
      'Milanin',
      'mugurelionut',
      'nhzp339',
      'PaulJefferys',
      'tomerun',
      'wleite',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'birdofpreyru',
    portrait: winnerDevelopment,
    finalists: [
      'billsedison',
      'chok68',
      'fivestarwy',
      'jiangliwu',
      'ketzjs09',
      'NightWolf',
      'ouyangki',
      'seriyvolk83',
      'Sky_',
      'spanhawk',
      'veshu',
    ],
  },

  // FIRST2FINISH Data Starts Here
  first2finish: {
    winner: 'akinwale',
    portrait: winnerFirst2finish,
    finalists: [
      'faft300punk',
      'gondzo',
      'happyesthete',
      'ian-sadovy',
      'mishacucicea',
      'moahhasbias',
      'ouyangki',
      'thomaskranitsas',
      'vasilica.olariu',
      'veshu',
    ],
  },

  // UI DESIGN Data Starts Here
  uiDesign: {
    winner: 'kharm',
    portrait: winnerUiDesign,
    finalists: [
      'iamtong',
      'djackmania',
      'eriantoongko',
      'Tewibowo',
      'Ravijune',
      'universo',
      'zazulyaziz',
      'abedavera',
      'yoki',
      'yiming',
      'chekspir',
      'ariefk',
      'khanhlinh',
    ],
  },

  // UI PROTOTYPE Data Starts Here
  uiPrototype: {
    winner: 'moulyg',
    portrait: winnerUiPrototype,
    finalists: [
      'Cristian77',
      'daga_sumit',
      'happyesthete',
      'hi4sandy',
      'iversonLv',
      'leo.ananth',
      'nghi85',
      'smtryingcode',
      'thomaskranitsas',
      'vasilica.olariu',
    ],
  },
};
