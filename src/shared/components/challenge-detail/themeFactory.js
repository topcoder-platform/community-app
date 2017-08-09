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

// import primaryDesignButtonStyle from '../buttons/primaryDesign.scss';
// import primaryDevelopButtonStyle from '../buttons/primaryDevelop.scss';
// import primaryDataScienceButtonStyle from '../buttons/primaryDataScience.scss';

export default function factory(track) {
  /* Currently track value can come either from Topcoder API v2, where it is
   * lowercase, or from Topcoder API v3, where it is upper-case. Thus, we have
   * to normalize. */
  switch (track.toLowerCase()) {
    case COMPETITION_TRACKS.DATA_SCIENCE:
      return {
        // PrimaryButton: primaryDataScienceButtonStyle,
      };
    case COMPETITION_TRACKS.DESIGN:
      return {
        // PrimaryButton: primaryDesignButtonStyle,
      };
    case COMPETITION_TRACKS.DEVELOP:
      return {
        // PrimaryButton: primaryDevelopButtonStyle,
      };
    default:
      throw new Error('Wrong competition track value!');
  }
}
