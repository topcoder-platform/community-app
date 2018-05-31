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
import winnerModDash from './winnerModDash.png';
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
  learnMoreURL: 'http://tccommunity.wpengine.com/tco12/',
  browseGalleryURL: 'https://www.flickr.com/photos/53993064@N03/albums/72157631669685927',
  location: 'Orlando, Florida, USA',
  date: 'Sept 20 - Oct 4, 2012',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'Egor',
    portrait: winnerAlgorithm,
    finalists: [
      '[[iwi]]',
      '_Romka_',
      'ACRush',
      'Dlougach',
      'dolphinigle',
      'exod40',
      'PaulJefferys',
      'RAVEman',
      'sdya',
      'SergeiFedorov',
      'theycallhimtom',
      'andrewzta',
      'Burunduk1',
      'Dmitry_Egorov',
      'dzhulgakov',
      'kalinov',
      'Kankuro',
      'marcina007',
      'marek.cygan',
      'meret',
      'pieguy',
      'shangjingbo',
      'wata',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'ainu7',
    portrait: winnerMarathon,
    finalists: [
      'ACRush',
      'blackmath',
      'chokudai',
      'colun',
      'hirosegolf',
      'Mojito1',
      'nhzp339',
      'Psyho',
      'tomerun',
      'wata',
      'wleite',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'Yeung',
    portrait: winnerDevelopment,
    finalists: [],
  },

  // FIRST2FINISH Data Starts Here
  modDash: {
    winner: 'hohosky',
    portrait: winnerModDash,
    finalists: [
      'Fanazhe',
      'FireIce',
      'flexme',
      'izhari',
      'LieutenantRoger',
      'notpad',
      'PE',
      'supercharger',
      'wz12',
      'Yeung',
      'Zulander',
    ],
  },

  design: {
    winner: 'argolite',
    portrait: winnerDesign,
    finalists: [],
  },

  studio: {
    winner: 'iamtong',
    portrait: winnerStudio,
    finalists: [
      'DaraK',
      'djackmania',
      'fairy_ley',
      'FXStudio',
      'thinkcreeper',
      'Trial_and_Error',
      'yoki',
    ],
  },
};
