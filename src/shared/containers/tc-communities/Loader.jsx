/**
 * Community Loader:
 * - Loads meta-data for the specified community;
 * - Checks visitor's authorization to access that community;
 * - Either renders community content, or the access denied page.
 */

/* global window */

import _ from 'lodash';
import AccessDenied, { CAUSE as ACCESS_DENIED_REASON } from 'components/tc-communities/AccessDenied';
import actions from 'actions/tc-communities/meta';
import LoadingPagePlaceholder
  from 'components/tc-communities/LoadingPagePlaceholder';
import PT from 'prop-types';
import React from 'react';
import { config } from 'topcoder-react-utils';
import { connect } from 'react-redux';

/**
 * When community Loader is mounted, and when it receives new props, these are
 * good moments to silently update community meta-data, to ensure that visitor
 * sees up-to-date information. It does not makes sense, though, to update them
 * too often. This value specifies the threshold between the latest update of
 * community meta-data and the earliest moment when they can be updated again.
 * It is not exposed to the general config to avoid polluting it. Most probably,
 * nobody will ever touch this constant.
 */
// const MAXAGE = 60 * 1000; /* ms */

class Loader extends React.Component {
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      communityId, loadingMeta, meta, tokenV3,
    } = nextProps;

    const {
      visitorGroups,
    } = this.props;

    const returnUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}`);

    if (!loadingMeta && (
      !meta /* || (Date.now() - meta.timestamp) > MAXAGE */
    )) nextProps.loadMetaData(communityId, tokenV3);

    /* TODO: This is a hacky way to handle SSO authentication for TopGear */
    if (communityId === 'comcast' && !visitorGroups) {
      window.location = `${config.URL.AUTH}/member?retUrl=${returnUrl}&utm_source=${communityId}`;
    }

    /* Redirect old TopGear home to new TopGear App and login redirect */
    if (communityId === 'wipro') {
      if (!visitorGroups) {
        window.location = `${config.URL.AUTH}/?retUrl=${returnUrl}&utm_source=${communityId}`;
      } else if (window.location.pathname === '/' || window.location.pathname === '/__community__/wipro') {
        window.location = config.URL.TOPGEAR;
      }
    }
  }

  render() {
    const {
      Community,
      communityId,
      meta,
      visitorGroups,
      isLoadingTerms,
    } = this.props;

    // if community has terms and they are not loaded yet, then this is true
    const hasNotLoadedTerms = meta && meta.terms && (meta.terms.length > 0) && isLoadingTerms;

    /* In case we are missing meta data, or information about some user groups
     * we need, we show loading indicator (for better user experience, we are
     * fine to accept outdated data; such data will be silently refreshed
     * behind the scene shortly). */
    if (!meta || hasNotLoadedTerms) return <LoadingPagePlaceholder />;

    const visitorGroupIds = visitorGroups ? visitorGroups.map(g => g.id) : [];

    const member = Boolean(visitorGroups && meta.groupIds
      && _.intersection(meta.groupIds, visitorGroupIds).length);

    /* Community does not require authorization. */
    if (!meta.authorizedGroupIds) return Community({ member, meta });

    /* Visitor is not authenticated. */
    if (!visitorGroups) {
      /* TODO: In case of TopGear (Wipro) community, if user is not
       * authenticated he is automatically redirected to SSO auth URL,
       * while that redirection is handled we want to show page loading
       * placeholder rather than access denied message. In future a more
       * generic implementation of this should be put here. */
      if (communityId === 'wipro' || communityId === 'comcast') return <LoadingPagePlaceholder />;
      // Only fo Zurich community we implement special auth system described
      // here: https://github.com/topcoder-platform/community-app/issues/1878
      // at this check specially we allow not authenticated visitos
      // to see the "Public Site" on Zurich
      if (communityId === 'zurich') return Community({ member, meta });
      // All other get the not authorized page

      console.log('Rendering Access Denied - Not Authenticated for !visitorGroups');
      console.log(visitorGroups, meta, communityId, member);

      return (
        <AccessDenied
          cause={ACCESS_DENIED_REASON.NOT_AUTHENTICATED}
          communityId={communityId}
          viewportId={meta.accessDeniedPage.viewportId}
          spaceName={meta.accessDeniedPage.spaceName}
          environment={meta.accessDeniedPage.environment}
        />
      );
    }

    /* Visitor belongs to at least one of the groups authorized to access this
     * community. */
    if (_.intersection(meta.authorizedGroupIds, visitorGroupIds).length) {
      return Community({ member, meta });
    }
    if (communityId === 'zurich') {
      // Again only for Zurich we have a special error page
      // handled via Contentful. We allow to pass here and return in for visitors that do not belong
      // to any groups authorized to access this community
      return Community({ member, meta });
    }

    console.log('Rendering Access Denied - Not Authenticated');
    console.log(visitorGroups, meta, communityId, member);

    /* Visitor is not authorized to access this community. */
    return (
      <AccessDenied
        cause={ACCESS_DENIED_REASON.NOT_AUTHORIZED}
        viewportId={meta.accessDeniedPage.viewportId}
        spaceName={meta.accessDeniedPage.spaceName}
        environment={meta.accessDeniedPage.environment}
      />
    );
  }
}

Loader.defaultProps = {
  meta: null,
  isLoadingTerms: false,
  tokenV3: '',
  visitorGroups: null,
};

Loader.propTypes = {
  Community: PT.func.isRequired,
  communityId: PT.string.isRequired,
  loadingMeta: PT.bool.isRequired,
  loadMetaData: PT.func.isRequired,
  isLoadingTerms: PT.bool,
  meta: PT.shape({
    authorizedGroupIds: PT.arrayOf(PT.string),
    communityId: PT.string.isRequired,
    terms: PT.any,
    groupIds: PT.any,
    accessDeniedPage: PT.any,
  }),
  tokenV3: PT.string,
  visitorGroups: PT.arrayOf(PT.shape({ id: PT.string.isRequired })),
};

function mapStateToProps(state, ownProps) {
  const { communityId } = ownProps;

  let { meta } = state.tcCommunities;
  const loadingMeta = communityId === meta.loadingOperationId;
  meta = meta.data;
  if (_.get(meta, 'communityId') !== communityId) meta = null;

  return {
    Community: ownProps.communityComponent,
    communityId,
    loadingMeta,
    meta,
    tokenV3: _.get(state, 'auth.tokenV3'),
    visitorGroups: _.get(state, 'auth.profile.groups'),
    isLoadingTerms: _.isEqual(state.terms.loadingTermsForEntity, {
      type: 'community',
      id: communityId,
    }),
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.tcCommunities.meta;
  return {
    loadMetaData: (communityId, tokenV3) => {
      dispatch(a.fetchDataInit(communityId));
      dispatch(a.fetchDataDone(communityId, tokenV3));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
