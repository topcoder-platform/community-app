import React, { useEffect } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import profileActions from 'actions/page/profile';
import MetaTags from 'components/MetaTags';
import LoadingIndicator from 'components/LoadingIndicator';
import ProfileBadgesPage from 'components/ProfileBadgesPage';
import { isEmpty } from 'lodash';

function ProfileBadgesContainer(props) {
  const { handleParam, badges, loadBadges } = props;
  const title = `${handleParam} | Community Profile | Topcoder`;
  const description = `Meet Topcoder member ${handleParam} and view their community awards and honors.`;

  useEffect(() => {
    loadBadges(handleParam);
  }, []);

  return (
    <React.Fragment>
      <MetaTags
        description={description}
        title={title}
      />
      {
        !isEmpty(badges) ? (
          <ProfileBadgesPage
            {...props}
          />
        ) : <LoadingIndicator />
      }
    </React.Fragment>
  );
}

ProfileBadgesContainer.defaultProps = {
  profile: null,
};

ProfileBadgesContainer.propTypes = {
  profile: PT.shape(),
  loadBadges: PT.func.isRequired,
  handleParam: PT.string.isRequired,
  badges: PT.shape().isRequired,
};

function mapStateToProps(state, ownProps) {
  const profile = state.auth && state.auth.profile ? { ...state.auth.profile } : {};
  return {
    handleParam: ownProps.match.params.handle,
    badges: state.page.profile[ownProps.match.params.handle]
      ? state.page.profile[ownProps.match.params.handle].badges : {},
    profile,
  };
}

function mapDispatchToActions(dispatch) {
  return {
    loadBadges: (handle) => {
      dispatch(profileActions.page.profile.getGamificationBadgesInit(handle));
      dispatch(profileActions.page.profile.getGamificationBadgesDone(handle, 100));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(ProfileBadgesContainer);
