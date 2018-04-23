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
import winnerArchitecture from './winnerArchitecture.jpg';
import winnerAssembly from './winnerAssembly.jpg';
import winnerMarathon from './winnerMarathon.jpg';
import winnerComponentDevelopment from './winnerComponentDevelopment.jpg';
import winnerComponentDesign from './winnerComponentDesign.jpg';
import winnerModDash from './winnerModDash.jpg';
import winnerSpecification from './winnerSpecification.jpg';
import winnerStudio from './winnerStudio.jpg';

/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreURL: 'https://community.topcoder.com/tc?module=Static&d1=tournaments&d2=tco09&d3=overview&d4=overview',
  browseGalleryURL: 'https://www.flickr.com/photos/53993064@N03/sets/72157664380469801',
  location: 'Las Vegas, Nevada, USA',
  date: 'Jun 1 - Jun 4, 2009',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'crazyb0y',
    portrait: winnerAlgorithm,
    finalists: [
      'UdH-WiNGeR',
      'marek.cygan',
      'Gluk',
      'lucasr',
      'Ostap',
      'pdallago',
      'Petr',
      'Im2Good',
      'SnapDragon',
      'syg96',
      'wata',
      'yuhch123',
      'WSX',
      '(iwi)',
      'ACRush',
      'andrewzta',
      'blueblimp',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'KOTEHOK',
    portrait: winnerMarathon,
    finalists: [
      'AlexanderL',
      'jdmetz',
      'maniek',
      'nhzp339',
      'prober',
      'Psyho',
      'roma',
      'wleite',
      'zibada',
    ],
  },

  // DEVELOPMENT Data Starts Here
  componentDevelopment: {
    winner: 'assistant',
    portrait: winnerComponentDevelopment,
    finalists: [
      'EveningSun',
      'Hacker_QC',
      'hefeng',
      'iKnown',
      'morehappiness',
      'myxgyy',
      'Orange_Cloud',
      'romanoTC',
      'velorien',
    ],
  },

  componentDesign: {
    winner: 'saarixx',
    portrait: winnerComponentDesign,
    finalists: [
      'argolite',
      'bramandia',
      'caru',
      'gevak',
      'Indemar',
      'Mafy',
      'nicka81',
      'Pops',
      'Standlove',
    ],
  },

  // FIRST2FINISH Data Starts Here
  modDash: {
    winner: 'PE',
    portrait: winnerModDash,
    finalists: [
      'cucu',
      'enefem21',
      'Margarita',
      'saarixx',
      'ShindouHikaru',
      'will.xie',
      'Yeung',
    ],
  },

  assembly: {
    winner: 'pulky',
    portrait: winnerAssembly,
    finalists: [
      'BeBetter',
      'oldbig',
      'PE',
      'pinoydream',
      'retunsky',
    ],
  },

  architecture: {
    winner: 'Standlove',
    portrait: winnerArchitecture,
    finalists: [
      'AleaActaEst',
      'argolite',
      'Ghostar',
      'saevio',
      'the_best',
    ],
  },

  specification: {
    winner: 'AleaActaEst',
    portrait: winnerSpecification,
    finalists: [
      'MiG-29',
    ],
  },

  // UI PROTOTYPE Data Starts Here
  studio: {
    winner: 'djnapier',
    portrait: winnerStudio,
    finalists: [
      'oninkxronda',
      'djackmania',
      'abedavera',
      'Elizabethhee',
      'foxyhu',
      'oton',
      'mahestro',
      'sweetpea',
      'Tricia_Tjia',
    ],
  },
};
