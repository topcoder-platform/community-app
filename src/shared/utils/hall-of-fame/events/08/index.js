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
import winnerMarathon from './winnerMarathon.png';
import winnerComponentDevelopment from './winnerComponentDevelopment.jpg';
import winnerComponentDesign from './winnerComponentDesign.jpg';
import winnerStudio from './winnerStudio.png';

/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreURL: 'https://www.topcoder.com/tc?module=Static&d1=tournaments&d2=tco08&d3=about',
  browseGalleryURL: 'https://www.flickr.com/photos/53993064@N03/albums/72157664501932526',
  location: 'Las Vegas, Nevada, USA',
  date: 'May 11 - 15, 2008',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'tomek',
    portrait: winnerAlgorithm,
    finalists: [
      '(iwi)',
      '_efer_',
      'Abednego',
      'ACRush',
      'ahyangyi',
      'Alexus',
      'andrewzta',
      'ardiankp',
      'asaveljevs',
      'bhzhan',
      'blueblimp',
      'bmerry',
      'Burunduk1',
      'Burunduk2',
      'cyfra',
      'dmytro',
      'eonx',
      'Eryx',
      'falagar',
      'fuwenjie',
      'Gassa',
      'gawry',
      'Gluk',
      'grotmol',
      'hyyylr',
      'Im2Good',
      'inazz',
      'izulin',
      'jakubr',
      'Jan_Kuipers',
      'Jasko',
      'John Dethridge',
      'kedaizd',
      'Klinck',
      'klopyrev',
      'KOTEHOK',
      'krijgertje',
      'ktuan',
      'lewha0',
      'liympanda',
      'Loner',
      'maciejk',
      'malcin',
      'marek.cygan',
      'mathijs',
      'nika',
      'olo',
      'overwise',
      'pashka',
      'PaulJefferys',
      'Petr',
      'ploh',
      'pparys',
      'Psyho',
      'Revenger',
      'Rizvanov_de_xXx',
      'SkidanovAlex',
      'Soultaker',
      'SpaceFlyer',
      'tomekkulczynski',
      'Vasyl(alphacom)',
      'venco',
      'victorsb',
      'VitalyGoldstein',
      'vlad89',
      'w_',
      'wintokk',
      'WSX',
      'xhl_kogitsune',
      'Yarin',
      'Ying',
    ],
  },

  // MARATHON Data Starts Here
  marathon: {
    winner: 'Psyho',
    portrait: winnerMarathon,
    finalists: [
      'paranoia',
      'brinky',
      'rahulgarg123',
      'doudouille',
      'tpelkone',
      'RatonulBolnav',
      'delicato',
      'wata',
      'Iquadrat',
      'bhzhan',
      'venco',
    ],
  },

  // DEVELOPMENT Data Starts Here
  componentDevelopment: {
    winner: 'romanoTC',
    portrait: winnerComponentDevelopment,
    finalists: [
      'cyberjag',
      'enefem21',
      'hefeng',
      'hotblue',
      'jueyey',
      'netsafe',
      'oldbig',
      'Orange_Cloud',
      'PE',
      'wiedzmin',
      'Xuchen',
    ],
  },

  // UI DESIGN Data Starts Here
  componentDesign: {
    winner: 'Pops',
    portrait: winnerComponentDesign,
    finalists: [
      'AleaActaEst',
      'argolite',
      'dmks',
      'fabrizyo',
      'humblefool',
      'kyky',
      'Luca',
      'ShindouHikaru',
      'tushak',
      'urtks',
      'Wendell',
    ],
  },

  // UI PROTOTYPE Data Starts Here
  studio: {
    winner: 'oninkxronda',
    portrait: winnerStudio,
    finalists: [
      'dogsoldier39',
      'Elizabethhee',
      'foxyhu',
      'abedavera',
      'djackmania',
      'oton',
      'Tricia_Tjia',
      'mahestro',
      'sweetpea',
      'Maraqja',
      'vlad_D',
    ],
  },
};
