/**
 * Container for dashboard announcement.
 */

import _ from 'lodash';
import actions from 'actions/cms/dashboard/announcements';
import Announcement from 'components/Dashboard/Announcement';
import cookies from 'browser-cookies';
import PT from 'prop-types';
import React from 'react';
import shortId from 'shortid';
import uiActions from 'actions/page/dashboard';
import { connect } from 'react-redux';

const COOKIE = 'lastSeenDashboardAnnouncement';
const MAXAGE = 10 * 60 * 1000;

class AnnouncementContainer extends React.Component {
  componentDidMount() {
    const {
      activeLoading,
      activeTimestamp,
      getActive,
    } = this.props;

    const now = Date.now();
    if (now - activeTimestamp > MAXAGE
    && !activeLoading) getActive();

    this.hideIfNecessary(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const id = _.get(this.props.active, 'sys.id');
    const nextId = _.get(nextProps.active, 'sys.id');
    if (id !== nextId) this.hideIfNecessary(nextProps);
    else if (!nextProps.show && this.props.show) {
      cookies.set(COOKIE, nextId);
    }
  }

  hideIfNecessary(props) {
    const { active, show, switchShowAnnouncement } = props;
    if (show) {
      const lastSeen = cookies.get(COOKIE);
      if (lastSeen === _.get(active, 'sys.id')) switchShowAnnouncement(false);
    }
    _.noop(this);
  }

  render() {
    const {
      active,
      activeAssets,
      activeLoading,
      show,
      switchShowAnnouncement,
    } = this.props;
    return (
      <Announcement
        assets={activeAssets}
        announcement={active}
        loading={activeLoading}
        show={show}
        switchShow={switchShowAnnouncement}
      />
    );
  }
}

AnnouncementContainer.defaultProps = {
  previewId: '',
};

AnnouncementContainer.propTypes = {
  active: PT.shape().isRequired,
  activeAssets: PT.shape().isRequired,
  activeLoading: PT.bool.isRequired,
  activeTimestamp: PT.number.isRequired,
  getActive: PT.func.isRequired,
  previewId: PT.string,
  show: PT.bool.isRequired,
  switchShowAnnouncement: PT.func.isRequired,
};

function mapStateToProps(state, props) {
  const a = state.cms.dashboard.announcements;
  return {
    active: a.active.data,
    activeAssets: a.active.assets,
    activeLoading: Boolean(a.active.loadingUuid),
    activeTimestamp: a.active.timestamp,
    previewId: props.previewId,
    show: state.page.dashboard.showAnnouncement,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getActive: () => {
      const uuid = shortId();
      const a = actions.cms.dashboard.announcements;
      dispatch(a.getActiveInit(uuid));
      dispatch(a.getActiveDone(uuid));
    },
    switchShowAnnouncement: show =>
      dispatch(uiActions.page.dashboard.showAnnouncement(show)),
  };
}

export default connect(mapStateToProps,
  mapDispatchToProps)(AnnouncementContainer);
