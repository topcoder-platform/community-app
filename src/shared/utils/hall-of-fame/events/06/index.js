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
import winnerComponentDevelopment from './winnerComponentDevelopment.jpg';
import winnerComponentDesign from './winnerComponentDesign.jpg';


/**
 * Data for the event goes here, and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
*/
export default {
  logo,
  banner,
  learnMoreURL: 'https://www.topcoder.com/tc?module=Static&d1=tournaments&d2=tco06&d3=about',
  browseGalleryURL: 'https://www.flickr.com/photos/53993064@N03/albums/72157663983790530',
  location: 'Las Vegas, Nevada, USA',
  date: 'May 3 - May 5, 2006',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'Petr',
    portrait: winnerAlgorithm,
    finalists: [
      'andrewzta',
      'antimatter',
      'BjarkeDahlEbert',
      'bladerunner',
      'bus',
      'cyfra',
      'DarLam',
      'Egor',
      'embe',
      'Eryx',
      'fuwenjie',
      'gepa',
      'gevak',
      'grotmol',
      'halyavin',
      'Im2Good',
      'jakubr',
      'John Dethridge',
      'JongMan',
      'kalinov',
      'kalmakka',
      'krijgertje',
      'Krzysan',
      'liympanda',
      'lucab',
      'm00tz',
      'marek.cygan',
      'mathijs',
      'MikeMirzayanov',
      'misof',
      'natori',
      'nicka81',
      'OpenGL',
      'pawel12',
      'ploh',
      'po',
      'pparys',
      'reid',
      'Ruberik',
      'SnapDragon',
      'tomal',
      'tomek',
      'Ulan',
      'w_',
      'wdtseng',
      'Yarin',
      'Ying',
    ],
  },

  // DEVELOPMENT Data Starts Here
  componentDevelopment: {
    winner: 'sindu',
    portrait: winnerComponentDevelopment,
    finalists: [
      'biotrail',
      'cnettel',
      'colau',
      'oodinary',
      'traugust',
      'visualage',
      'zjq',
    ],
  },

  // UI DESIGN Data Starts Here
  uiDesign: {
    winner: 'Pops',
    portrait: winnerComponentDesign,
    finalists: [
      'adic',
      'AleaActaEst',
      'aubergineanode',
      'kyky',
      'nicka81',
      'real_vg',
      'ThinMan',
    ],
  },
};
