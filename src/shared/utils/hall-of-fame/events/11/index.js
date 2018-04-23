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
import winnerModDash from './winnerModDash.jpg';
import winnerDesign from './winnerDesign.png';
import winnerStudio from './winnerStudio.jpg';

/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreURL: 'http://tccommunity.wpengine.com/tco11/',
  browseGalleryURL: 'https://www.flickr.com/photos/53993064@N03/sets/72157625031026589',
  location: 'Fort Lauderdale, Florida, USA',
  date: 'Sept 25 - Sept 28, 2011',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'rng_58',
    portrait: winnerAlgorithm,
    finalists: [
      '[[iwi]]',
      '_Romka_',
      '7ania7',
      'A_A_Lunyov',
      'ACRush',
      'ainu7',
      'bmerry',
      'gawry',
      'Kankuro',
      'LayCurse',
      'lyrically',
      'marek.cygan',
      'Mike Mirzayanov',
      'mikhailOK',
      'nika',
      'PaulJefferys',
      'Petr',
      'pieguy',
      'RAD.',
      'SergeiRogulenko',
      'theycallhimtom',
      'unbing',
      'Vitaliy',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'Psyho',
    portrait: winnerMarathon,
    finalists: [
      'ACRush',
      'ainu7',
      'chokudai',
      'jdmetz',
      'komiya',
      'nhzp339',
      'ploh',
      'RAVEman',
      'Rizvanov_de_xXx',
      'wata',
      'wleite',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'Yeung',
    portrait: winnerDevelopment,
    finalists: [
      'yext',
      'cyberjag',
      'flexme',
      'j3_guile',
      'mohamede1945',
      'RaitoShum',
      'sandaruwang',
      'sunnysummer',
      'tangzx',
    ],
  },

  modDash: {
    winner: 'Yeung',
    portrait: winnerModDash,
    finalists: [
      'Fanazhe',
      'FireIce',
      'flexme',
      'hohosky',
      'iRabbit',
      'JGeeks',
      'rac_',
      'Shraddha_Gusai',
      'supercharger',
      'yext',
      'Zulander',
    ],
  },

  design: {
    winner: 'BLE',
    portrait: winnerDesign,
    finalists: [
      'argolite',
      'faeton',
      'gevak',
      'MiG-29',
      'nikolay83',
      'saarixx',
      'winterflame',
    ],
  },

  studio: {
    winner: 'abedavera',
    portrait: winnerStudio,
    finalists: [
      'CMYK',
      'djackmania',
      'djnapier',
      'fairy_ley',
      'iamtong',
      'idblack',
      'oninkxronda',
      'puchki',
      'thinkcreeper',
    ],
  },
};
