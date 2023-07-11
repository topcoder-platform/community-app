/**
 * The loader of Profile webpack chunks.
 */
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';

export default function ProfileLoader(props) {
  if (typeof window !== 'undefined') {
    const {
      match: {
        params: { handle },
      },
    } = props;
    window.location.replace(`${config.MEMBER_PROFILE_REDIRECT_URL}/${handle}`); // totest
  }
  return null;
}

ProfileLoader.propTypes = {
  match: PT.shape({
    params: PT.shape({
      handle: PT.string,
    }),
  }).isRequired,
};
