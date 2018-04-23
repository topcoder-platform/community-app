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
  learnMoreURL: 'https://www.topcoder.com/tc?module=Static&d1=tournaments&d2=tco04&d3=about',
  browseGalleryURL: 'https://www.flickr.com/photos/53993064@N03/albums/72157663994702520',
  location: 'Santa Clara, California, USA',
  date: 'Nov 11 - Nov 12, 2004',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'tomek',
    portrait: winnerAlgorithm,
    finalists: [
      'SnapDragon',
      'reid',
      'snewman',
    ],
  },

  // DEVELOPMENT Data Starts Here
  development: {
    winner: 'Standlove',
    portrait: winnerComponentDevelopment,
    finalists: [
      'chippydip',
      'ShindouHikaru',
    ],
  },

  // UI DESIGN Data Starts Here
  uiDesign: {
    winner: 'adic',
    portrait: winnerComponentDesign,
    finalists: [
      'kyky',
      'aksonov',
      'MPhk',
    ],
  },
};
