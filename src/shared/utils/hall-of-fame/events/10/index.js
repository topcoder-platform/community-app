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
import winnerMarathon from './winnerMarathon.jpg';
import winnerDevelopment from './winnerDevelopment.jpg';
import winnerModDash from './winnerModDash.jpg';
import winnerDesign from './winnerDesign.jpg';
import winnerStudio from './winnerStudio.jpg';

/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreURL: 'https://www.topcoder.com/tc?module=Static&d1=tournaments&d2=tco10&d3=overview&d4=overview',
  browseGalleryURL: 'https://www.flickr.com/photos/53993064@N03/sets/72157625031026589',
  location: 'Las Vegas, Nevada, USA',
  date: 'Oct 11 - Oct 14, 2010',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'rng_58',
    portrait: winnerAlgorithm,
    finalists: [
      'ACRush',
      'Klinck',
      'AS1_PML30',
      'bmerry',
      'dzhulgakov',
      'gmark',
      'griffon',
      'grotmol',
      'izulin',
      'kefir',
      'liympanda',
      'Louty',
      'lucasr',
      'Mimino',
      'Onufry',
      'PaulJefferys',
      'Petr',
      'RAD.',
      'syg96',
      'tomekkulczynski',
      'Vasyl[alphacom]',
      'w_',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'wata',
    portrait: winnerMarathon,
    finalists: [
      'chokudai',
      'doudouille',
      'ACRush',
      'ainu7',
      'irakli',
      'jdmetz',
      'nhzp339',
      'O_O',
      'ploh',
      'Psyho',
      'tpelkone',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'Yeung',
    portrait: winnerDevelopment,
    finalists: [
      'FireIce',
      'flexme',
      'iRabbit',
      'iversonLv',
      'mumujava',
      'sandaruwang',
      'velorien',
      'yext',
    ],
  },

  // FIRST2FINISH Data Starts Here
  modDash: {
    winner: 'Margarita',
    portrait: winnerModDash,
    finalists: [
      'supercharger',
      'Yeung',
      '2PaVeL',
      'hohosky',
      'HumbleSunflower',
      'rac_',
      'rst9288',
      'TeCNoYoTTa',
    ],
  },

  // UI DESIGN Data Starts Here
  design: {
    winner: 'argolite',
    portrait: winnerDesign,
    finalists: [
      'abkqz',
      'AleaActaEst',
      'caru',
      'faeton',
      'kurtrips',
      'saarixx',
      'Urmass',
    ],
  },

  studio: {
    winner: 'djackmania',
    portrait: winnerStudio,
    finalists: [
      'djnapier',
      'abedavera',
      'idblack',
      'kathymak',
      'mahestro ',
      'oninkxronda',
      'puchki',
      'CMYK',
      'daddum',
    ],
  },
};
