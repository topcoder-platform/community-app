/**
 * This helper module provides a theme factory for challenge detail page.
 * Factory function takes competition track and returns a context theme
 * for react-css-themr.
 *
 * NOTE: The main reason to put it into a separate module is to be able to use
 * anonymous stylesheet import in the Header component, which otherwise needs
 * even more refactoring then now.
 */

import { COMPETITION_TRACKS } from 'utils/tc';

import primaryDevelopTagStyle from '../tags/primary/develop.scss';
import primaryDataScienceTagStyle from '../tags/primary/data-science.scss';
import eventDevelopTagStyle from '../tags/event/develop.scss';
import eventDataScienceTagStyle from '../tags/event/data-science.scss';

export default function factory(track) {
  /* Currently track value can come either from Topcoder API v2, where it is
   * lowercase, or from Topcoder API v3, where it is upper-case. Thus, we have
   * to normalize. */
  switch (track.toLowerCase()) {
    case COMPETITION_TRACKS.DATA_SCIENCE:
      return {
        PrimaryTag: primaryDataScienceTagStyle,
        EventTag: eventDataScienceTagStyle,
      };
    case COMPETITION_TRACKS.DESIGN:
      return {

      };
    case COMPETITION_TRACKS.DEVELOP:
      return {
        PrimaryTag: primaryDevelopTagStyle,
        EventTag: eventDevelopTagStyle,
      };
    default:
      throw new Error('Wrong competition track value!');
  }
}
