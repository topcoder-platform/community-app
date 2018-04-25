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
import winnerStudio from './winnerStudio.jpg';
import winnerDesign from './winnerDesign.jpeg';

/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreURL: 'http://tccommunity.wpengine.com/tco13/overview/',
  browseGalleryURL: 'http://tccommunity.wpengine.com/tco13/overview/photos/',
  location: 'Washington DC, USA',
  date: 'Nov 10 - Nov 13, 2013',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'Petr',
    portrait: winnerAlgorithm,
    finalists: [
      '[[iwi]]',
      'andrewzta',
      'aropan',
      'cgy4ever',
      'darnley',
      'dzhulgakov',
      'Egor',
      'ir5',
      'Jedi_Knight',
      'ke1vin',
      'marcina007',
      'Mimino',
      'msg555',
      'nika',
      'peter50216',
      'Petr',
      'rejudge',
      'sdya',
      'theycallhimtom',
      'tomek',
      'tourist',
      'UdH-WiNGeR',
      'v3ctor',
      'wata',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'Psyho',
    portrait: winnerMarathon,
    finalists: [
      'ACRush',
      'ainu7',
      'blackmath',
      'chokudai',
      'colun',
      'doudouille',
      'eldidou',
      'Komaki',
      'Milanin',
      'nhzp339',
      'wleite',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'morehappiness',
    portrait: winnerDevelopment,
    finalists: [
      'j3_guile',
      'Yeung',
      'GreatKevin',
      'subchap',
      'vvvpig',
      'duxiaoyang',
      'flexme',
      'billthu',
      'velorien',
      'sparemax',
      'flytoj2ee',
    ],
  },

  // FIRST2FINISH Data Starts Here
  modDash: {
    winner: 'supercharger',
    portrait: winnerModDash,
    finalists: [
      'akinwale',
      'gogocrow',
      'kalc',
      'LieutenantRoger',
      'MonicaMuranyi',
      'moulyg',
      'notpad',
      'subchap',
      'TrePe',
      'wz12',
      'Yeung',
    ],
  },

  studio: {
    winner: 'abedavera',
    portrait: winnerStudio,
    finalists: [
      'fairy_ley',
      'FxStudio',
      'iamtong',
      'idblack',
      'iMadReactions',
      'kelvinwebdesign',
      'oninkxronda',
      'thinkcreeper',
      'yoki',
    ],
  },

  design: {
    winner: 'albertwang ',
    portrait: winnerDesign,
    finalists: [
      'AleaActaEst',
      'argolite',
      'BLE',
      'Indemar',
      'kurtrips',
      'MiG-29',
      'Standlove',
      'vangavroche',
    ],
  },

  // Trip Winners Data Starts Here
  tripWinners: [
    {
      role: 'CLOUDSPOKE',
      winners: [
        'PaulKolbovich',
        'callmekatootie',
        'jan3594',
        'shankarkamble',
        'soe',
        'wcheung',
        'aproxacs',
        'Manish_Kumar',
        'KnowledgeLover',
        'logontokartik',
        'eucuepo',
        'chok68',
        'Debadyuti',
        'enreeco/ForceLogic',
      ],
    },
  ],
};
