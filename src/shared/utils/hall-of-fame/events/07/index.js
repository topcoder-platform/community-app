/**
 * Data and images for TCO Event
*/

/**
* These lines won't need to be changed unless an image needs a different file extension.
* If an event did not have the corresponding TRACK, the entire line can be commented out.
*/
import logo from './logo.png';
import banner from './banner.png';

import winnerAlgorithm from './winnerAlgorithm.jpg';
import winnerMarathon from './winnerMarathon.jpg';
import winnerComponentDevelopment from './winnerComponentDevelopment.jpg';
import winnerComponentDesign from './winnerComponentDesign.jpg';
import winnerStudio from './winnerStudio.jpg';

/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreURL: 'https://www.topcoder.com/tc?module=Static&d1=tournaments&d2=tco07&d3=about',
  browseGalleryURL: 'https://www.topcoder.com/tc?module=Static&d1=tournaments&d2=tco07&d3=photos',
  location: 'Las Vegas, Nevada, USA',
  date: 'Jun 26 - Jun 29, 2007',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'Jan_Kuipers',
    portrait: winnerAlgorithm,
    finalists: [
      'ACRush',
      'Eryx',
      'liympanda',
      'Ying',
      'Per',
      'cyfra',
      'JongMan',
      'lovro',
      'lars',
      'Vasyl[alphacom]',
      'xhl_kogitsune',
      'w_',
      'Tomy',
      'xOberon',
      'gunnark',
      'tomek',
      'misof',
      'marek.cygan',
      'gawry',
      'bladerunner',
      'tomekkulczynski',
      'jakubr',
      'Astein',
      'marian',
      'Vitaliy',
      'VitalyGoldstein',
      'abikbaev',
      'dmytro',
      'gevak',
      'msg555',
      'wleite',
      'SnapDragon',
      'andrewzta',
      'ploh',
      'bmerry',
      'Revenger',
      'darnley',
      'falagar',
      'tmyklebu',
      'Vedensky',
      'pashka',
      'Gluk',
      'Andrew_Lazarev',
      'nicka81',
      'HiltonLange',
      'ltdtl',
      'yava',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'Mojito1',
    portrait: winnerMarathon,
    finalists: [
      'jdmetz',
      'prober',
      '.Invader',
      'doudouille',
      'grotmol',
      'Maris',
    ],
  },

  // DEVELOPMENT Data Starts Here
  componentDevelopment: {
    winner: 'hefeng',
    portrait: winnerComponentDevelopment,
    finalists: [
      'cnettel',
      'enefem21',
      'PE',
      'tyrian',
      'wolve',
    ],
  },

  // UI DESIGN Data Starts Here
  componentDesign: {
    winner: 'kyky',
    portrait: winnerComponentDesign,
    finalists: [
      'AleaActaEst',
      'argolite',
      'bendlund',
      'kakarotto',
      'oldbam',
      'sql_lall',
    ],
  },

  // UI PROTOTYPE Data Starts Here
  studio: {
    winner: 'yiming',
    portrait: winnerStudio,
    finalists: [
      'amiune',
      'FMX',
      'Maraqja',
      'oton',
      'SIGCHLD',
      'Tricia_Tjia',
    ],
  },
};
