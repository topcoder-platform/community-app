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
  learnMoreURL: 'https://www.topcoder.com/tc?module=Static&d1=tournaments&d2=tco05&d3=about',
  browseGalleryURL: 'https://www.flickr.com/photos/53993064@N03/albums/72157662219960244',
  location: 'Santa Clara, California, USA',
  date: 'Oct 13 - Oct 14, 2005',
  totalPrizes: '$60,000',
  countryCount: 29,

  // ALGORITHM Data Starts Here
  algorithm: {
    winner: 'Eryx',
    portrait: winnerAlgorithm,
    finalists: [
      'Andrew_Lazarev',
      'antimatter',
      'ardiankp',
      'assembler',
      'aubergineanode',
      'cyfra',
      'DamianK',
      'daveagp',
      'dgarthur',
      'elizarov',
      'futo',
      'gawry',
      'haha',
      'HardCoder',
      'hauser',
      'HilbertRaum',
      'HiltonLange',
      'Im2Good',
      'ivan_metelsky',
      'John Dethridge',
      'kalmakka',
      'krijgertje',
      'lars',
      'lovro',
      'lunaticfringe',
      'madking',
      'marek.cygan',
      'marian',
      'mickle',
      'misof',
      'natori',
      'nicka81',
      'NPermyakov',
      'overwise',
      'Petr',
      'ploh',
      'radeye',
      'RalphFurmaniak',
      'Ryan',
      'sjelkjd',
      'snewman',
      'texel',
      'tjq',
      'tomal',
      'venco',
      'Ying',
      'Zis',
    ],
  },

  // DEVELOPMENT Data Starts Here
  componentDevelopment: {
    winner: 'visualage',
    portrait: winnerComponentDevelopment,
    finalists: [
      'sindu',
      'oldbig',
      'arylio',
      'cnettel',
      'colau',
      'matmis',
    ],
  },

  // UI DESIGN Data Starts Here
  componentDesign: {
    winner: 'nicka81',
    portrait: winnerComponentDesign,
    finalists: [
      'Pops',
      'kyky',
      'aubergineanode',
      'dmks',
      'ShindouHikaru',
      'ThinMan',
      'victor_lxd',
    ],
  },
};
