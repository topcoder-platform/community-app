/**
 * Data and images for TCO Event
*/

/**
* These lines won't need to be changed unless an image needs a different file extension.
* If an event did not have the corresponding TRACK, the entire line can be commented out.
*/
import logo from './logo.png';
import banner from './banner.jpg';

import winnerAlgorithm from './winnerAlgorithm.jpeg';
import winnerMarathon from './winnerMarathon.png';
import winnerDevelopment from './winnerDevelopment.jpg';
import winnerFirst2finish from './winnerFirst2finish.png';
import winnerStudio from './winnerStudio.png';
import winnerDesign from './winnerDesign.jpg';

/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreURL: 'https://tccommunity.wpengine.com/tco14/overview/',
  browseGalleryURL: 'https://tccommunity.wpengine.com/tco14/photos/',
  location: 'San Francisco, USA',
  date: 'Nov 16 - Nov 19, 2014',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'tourist',
    portrait: winnerAlgorithm,
    finalists: [
      'Petr',
      'Egor',
      'bmerry',
      'Endagorion',
      'wata',
      'WJMZBMR',
      'lyrically',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'Psyho',
    portrait: winnerMarathon,
    finalists: [
      'nhzp339',
      'Mojito1',
      'wleite',
      'marek.cygan',
      'nika',
      'ainu7',
      'Komaki',
      'eldidou',
      'Vasyl[alphacom]',
      'ACRush',
      'doudouille',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'Sky_',
    portrait: winnerDevelopment,
    finalists: [
      'LazyChild',
      'hi4sandy',
      'dljg718',
      'Zulander',
      'j3_guile',
      'vvvpig',
      'Ghost_141',
      'Standlove',
      'Yeung',
      'yedtoss',
      'morehappiness',
    ],
  },

  // FIRST2FINISH Data Starts Here
  first2finish: {
    winner: 'akinwale',
    portrait: winnerFirst2finish,
    finalists: [
      'gfhuertac',
      'Zulander',
      'MonicaMuranyi',
      'TrePe',
      'Yeung',
      'selvaa89',
      'bohuss',
      'supercharger',
      'FireIce',
      'LieutenantRoger',
    ],
  },

  design: {
    winner: 'albertwang',
    portrait: winnerDesign,
    finalists: [
      'faeton',
      'argolite',
      'BLE',
      'vangavroche',
      'winterflame',
      'AleaActaEst',
      'zsudraco',
      'flying2hk',
      'MiG-29',
      'Urmass',
      'kurtrips',
    ],
  },

  studio: {
    winner: 'fairy_ley',
    portrait: winnerStudio,
    finalists: [
      'abedavera',
      'idblack',
      'iamtong',
      'kelvinwebdesign',
      'yoki',
      'oninkxronda',
      'DaraK',
      'FxStudio',
      'puchki',
      'thinkcreeper',
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
      role: 'OTHERS',
      winners: [
        'mahestro',
        'misof',
        'Rustyoldman',
        'ForceLogic',
        'notpad',
        'sidthekid',
        'htfans',
        'BharathMG',
        'rjrojas',
        'callmekatootie',
        'talesforce',
      ],
    },
  ],
};
