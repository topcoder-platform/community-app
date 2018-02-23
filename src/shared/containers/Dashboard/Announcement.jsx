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
      getPreview,
      previewId,
    } = this.props;

    if (previewId) getPreview(previewId);
    else {
      const now = Date.now();
      if (now - activeTimestamp > MAXAGE
      && !activeLoading) getActive();
    }

    this.hideIfNecessary(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const id = _.get(this.props.active, 'sys.id');
    const nextId = _.get(nextProps.active, 'sys.id');
    if (id !== nextId) this.hideIfNecessary(nextProps);
    else if (!nextProps.show && this.props.show && !nextProps.previewId) {
      cookies.set(COOKIE, nextId);
    }
  }

  hideIfNecessary(props) {
    if (props.previewId) return;
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
      hidePreviewMetaData,
      preview,
      previewAssets,
      previewLoading,
      previewId,
      show,
      switchShowAnnouncement,
    } = this.props;
    return (
      <Announcement
        assets={previewId ? previewAssets : activeAssets}
        announcement={previewId ? preview : active}
        hidePreviewMetaData={hidePreviewMetaData}
        loading={previewId ? previewLoading : activeLoading}
        preview={Boolean(previewId)}
        show={show}
        switchShow={switchShowAnnouncement}
      />
    );
  }
}

AnnouncementContainer.defaultProps = {
  hidePreviewMetaData: false,
  previewId: '',
};

AnnouncementContainer.propTypes = {
  active: PT.shape().isRequired,
  activeAssets: PT.shape().isRequired,
  activeLoading: PT.bool.isRequired,
  activeTimestamp: PT.number.isRequired,
  hidePreviewMetaData: PT.bool,
  getActive: PT.func.isRequired,
  getPreview: PT.func.isRequired,
  preview: PT.shape().isRequired,
  previewAssets: PT.shape().isRequired,
  previewId: PT.string,
  previewLoading: PT.func.isRequired,
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
    hidePreviewMetaData: props.hidePreviewMetaData,
    preview: a.preview.data,
    previewAssets: a.preview.assets,
    previewLoading: Boolean(a.preview.loadingUuid),
    previewId: props.previewId,
    show: state.page.dashboard.showAnnouncement,
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.cms.dashboard.announcements;
  return {
    getActive: () => {
      const uuid = shortId();
      dispatch(a.getActiveInit(uuid));
      dispatch(a.getActiveDone(uuid));
    },
    getPreview: (id) => {
      const uuid = shortId();
      dispatch(a.getPreviewInit(uuid));
      dispatch(a.getPreviewDone(id, uuid));
    },
    switchShowAnnouncement: show =>
      dispatch(uiActions.page.dashboard.showAnnouncement(show)),
  };
}

export default connect(mapStateToProps,
  mapDispatchToProps)(AnnouncementContainer);
