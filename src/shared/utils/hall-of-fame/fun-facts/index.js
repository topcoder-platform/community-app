/**
 * Data and images for Fun Facts
*/

/**
* Any fun-fact photos that are to be hosted within Community App need to be added here:
*/
import photo1 from './1.jpg';
import photo2 from './2.jpg';
import photo3 from './3.jpg';

/**
 * Data for the fun facts go here and the format is very similar JSON.
 * Images can either be an url enclosed in single quotes,
 * or the name of one of the above local images.
 *
 * Html tags can be included in the fact.
*/
export default [
  {
    photo: photo1,
    fact: '<a href="https://www.topcoder.com/members/Kharm/">Kharm</a> was eliminated in the semi-final round during <a href="http://tco16.topcoder.com">TCO16</a> and he obviously has achieved a goal of not only returning for <a href="http://tco17.topcoder.com">TCO17</a> but also winning!',
  },
  {
    photo: photo2,
    fact: '2017 was <a href="https://www.topcoder.com/members/Psyho/">Psyho\'s</a> 10th year competing in the Topcoder Open.',
  },
  {
    photo: photo3,
    fact: 'Members from <a href="https://en.wikipedia.org/wiki/Indonesia">Indonesia</a> have dominated the design track finals since 2011.',
  },
];
